<?php
namespace AppBundle\EventListener;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\GenericEvent;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Psr\Log\LoggerInterface;
use AppBundle\Entity\Game;

class TriggerCalculationSubscriber implements EventSubscriberInterface
{
    private $logger;

    private $kernel;

    public function __construct(LoggerInterface $logger, KernelInterface $kernel)
    {
        $this->logger = $logger;
        $this->kernel = $kernel;
    }

    /**
     * getSubscribedEvents() static function
     */
    public static function getSubscribedEvents()
    {
        return array(
            'easy_admin.post_update' => array('triggerCalculation'),
        );
    }

    /**
     * triggerCalculation() function
     * Triggers a Symfony task to calculate prediction points for a finished game
     */
    public function triggerCalculation(GenericEvent $event)
    {
        $entity = $event->getSubject();

        if (!($entity instanceof Game)) {
            return;
        }

        if ($entity->getFinished()) {
            // Trigger task to calculate prediction's points
            $application = new Application($this->kernel);
            $application->setAutoExit(false);

            $input = new ArrayInput(array(
               'command' => 'app:process-predictions',
               '--game-id' => $entity->getId(),
            ));
            // You can use NullOutput() if you don't need the output
            $output = new BufferedOutput();
            $application->run($input, $output);
            // return the output, don't use if you used NullOutput()
            $content = $output->fetch();
            $this->logger->info('Start Process Predictions');
            $this->logger->info($content);
            $this->logger->info('End Process Predictions');
        }
    }
}