<?php

namespace AppBundle\EventListener;

use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpKernel\Controller\ControllerResolverInterface;
use Symfony\Component\Routing\Matcher\UrlMatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;

class LinkUnlinkRequestListener
{
    const LINK_METHOD = 'LINK';
    const UNLINK_METHOD = 'UNLINK';

    /**
     * @var EventDispatcherInterface
     */
    private $dispatcher;
    /**
     * @var ControllerResolverInterface
     */
    private $resolver;
    /**
     * @var UrlMatcherInterface
     */
    private $urlMatcher;

    /**
     * @param EventDispatcherInterface    $eventDispatcher    The 'event_dispatcher' service
     * @param ControllerResolverInterface $controllerResolver The 'controller_resolver' service
     * @param UrlMatcherInterface         $urlMatcher         The 'router' service
     */
    public function __construct(
        EventDispatcherInterface $eventDispatcher,
        ControllerResolverInterface $controllerResolver,
        UrlMatcherInterface $urlMatcher
    )
    {
        $this->dispatcher = $eventDispatcher;
        $this->resolver = $controllerResolver;
        $this->urlMatcher = $urlMatcher;
    }

    /**
     * onKernelRequest() function
     * @param GetResponseEvent $event
     */
    public function onKernelRequest(GetResponseEvent $event)
    {
        $requestMethod = $this->urlMatcher->getContext()->getMethod();
        $procMethod = strtolower($requestMethod);
        if (!$event->getRequest()->headers->has($procMethod)) {
            return;
        }

        $links  = array();
        $header = $event->getRequest()->headers->get($procMethod);

        /*
         * Due to limitations, multiple same-name headers are sent as comma
         * separated values.
         *
         * This breaks those headers into Link headers following the format
         * http://tools.ietf.org/html/rfc2068#section-19.6.2.4
         */
        while (preg_match('/^((?:[^"]|"[^"]*")*?),/', $header, $matches)) {
            $header  = trim(substr($header, strlen($matches[0])));
            $links[] = $matches[1];
        }

        if ($header) {
            $links[] = $header;
        }

        // Force the GET method to avoid the use of the
        // previous method (LINK/UNLINK)
        $this->urlMatcher->getContext()->setMethod('GET');

        // The controller resolver needs a request to resolve the controller.
        $stubRequest = new Request();

        foreach ($links as $idx => $link) {
            $linkParams = explode(';', trim($link));
            $resource   = array_shift($linkParams);
            $resource   = preg_replace('/<|>/', '', $resource);

            try {
                $route = $this->urlMatcher->match($resource);
            } catch (\Exception $e) {
                // If we don't have a matching route we return
                // the original Link header
                continue;
            }

            $stubRequest->attributes->replace($route);

            if (false === $controller = $this->resolver->getController($stubRequest)) {
                continue;
            }

            // Make sure @ParamConverter is handled
            $subEvent = new FilterControllerEvent($event->getKernel(), $controller, $stubRequest, HttpKernelInterface::MASTER_REQUEST);
            $this->dispatcher->dispatch(KernelEvents::CONTROLLER, $subEvent);
            $controller = $subEvent->getController();
            $arguments = $this->resolver->getArguments($stubRequest, $controller);

            try {
                $result = call_user_func_array($controller, $arguments);

                // By convention the controller action must return an object
                if (!is_object($result)) {
                    continue;
                }

                // The key of first item is discarded
                $links[$idx] = $result;
            } catch (\Exception $e) {
                continue;
            }
        }

        $event->getRequest()->attributes->set($procMethod . 's', $links);
        $this->urlMatcher->getContext()->setMethod($requestMethod);
    }
}
