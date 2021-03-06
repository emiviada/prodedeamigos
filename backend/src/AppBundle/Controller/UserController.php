<?php
namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpKernel\Exception\HttpException;
use FOS\RestBundle\Controller\FOSRestController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use FOS\RestBundle\View\View;

use AppBundle\Entity\User;
use AppBundle\Form\UserType;

class UserController extends FOSRestController
{
    /**
     * @Rest\Get("/users")
     */
    public function getAction(Request $request)
    {
        $defaultLimit = $this->container->getParameter('api.max_results_default');
        $findParams = array();
        $allowedSearchProperties = array('facebook_id');
        $propertyMapper = array('facebook_id' => 'facebookId');
        foreach ($allowedSearchProperties as $property) {
            if ($request->query->get($property)) {
                $findParams[$propertyMapper[$property]] = $request->query->get($property);
            }
        }
        $result = $this->getDoctrine()->getRepository('AppBundle:User')->findBy(
            $findParams,
            array(),
            $defaultLimit
        );
        if ($result === null) {
            throw new HttpException(404, 'There are no users exist');
        }

        return $result;
    }

    /**
     * @Rest\Get("/users/{id}", name="get_user")
     */
    public function idAction($id)
    {
        $result = $this->getDoctrine()->getRepository('AppBundle:User')->findOneById($id);
        if ($result === null) {
            throw new HttpException(404, 'User not found');
        }

        return $result;
    }

    /**
     * @Rest\Post("/users")
     */
    public function newAction(Request $request)
    {
        return $this->processForm(new User(), $request);
    }

    /**
     * @Rest\Put("/users/{id}")
     */
    public function editAction(User $user, Request $request)
    {
        return $this->processForm($user, $request);
    }

    /**
     * processForm() private method
     * @param User $user
     * @param Request $request
     */
    private function processForm(User $user, Request $request)
    {
        $statusCode = $user->isNew() ? 201 : 204;

        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);
        if ($request->getMethod() === 'PUT' && !$form->isSubmitted()) {
            $requestData = $request->request->get($form->getName());
            $requestData['email'] = $user->getEmail();
            $requestData['username'] = $user->getUsername();
            $requestData['password'] = $user->getPassword();
            $requestData['facebookId'] = $user->getFacebookId();
            $form->submit($requestData);
        }

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getEntityManager();
            $em->persist($user);
            $em->flush();

            $response = new Response();
            $response->setStatusCode($statusCode);

            // set the `Location` header only when creating new resources
            if (201 === $statusCode) {
                $response->headers->set('Location',
                    $this->generateUrl(
                        'get_user', array('id' => $user->getId()),
                        true // absolute
                    )
                );
            }

            return $response;
        }

        return View::create($form, 400);
    }

    /**
     * @Rest\Delete("/users/{id}")
     * @Rest\View(statusCode=204)
     */
    public function removeAction(User $user)
    {
        $em = $this->getDoctrine()->getEntityManager();
        $em->remove($user);
        $em->flush();
    }

    /**
     * @Rest\Post("/users/{id}/send-message")
     * @Rest\View(statusCode=200)
     */
    public function sendMessage($id, Request $request)
    {
        $user = $this->getDoctrine()->getRepository('AppBundle:User')->findOneById($id);
        if (is_null($user)) {
            throw new HttpException(404, 'User not found');
        }

        $postData = $request->request->get('message');
        $result = array('success' => 0);

        try {
            $message = \Swift_Message::newInstance()
                ->setSubject($postData['subject'])
                ->setFrom($user->getEmail())
                ->setTo($postData['to'])
                /*->setBody(
                    $this->renderView(
                        'HelloBundle:Hello:email.txt.twig',
                        array('name' => $name)
                    )
                )*/
                ->setBody($postData['text'], 'text/html')
            ;

            $sent = $this->get('mailer')->send($message);
            if ($sent) {
                $result['success'] = 1;
            }

        } catch (\Exception $e) {
            $result = array('success' => 0, 'error' => $e->getMessage());
        }

        return $result;
    }
}
