<?php
namespace AppBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputOption;

class ProcessPredictionsCommand extends ContainerAwareCommand
{
    /**
     * @var EntityManager $em
     */
    private $em;

    /**
     * @var array $involvedFantasyTournaments
     */
    private $involvedFantasyTournaments = array();

    /**
     * configure() function
     */
    protected function configure()
    {
        $this
            // the name of the command (the part after "bin/console")
            ->setName('app:process-predictions')
            // the short description shown while running "php bin/console list"
            ->setDescription('Process the game predictions once this has finished.')
            // the full command description shown when running the command with
            // the "--help" option
            ->setHelp('This command allows you to process the game predictions once this has finished.')
        ;

        $this
            // Game ID to processs
            ->addOption(
                'game-id',
                null,
                InputOption::VALUE_REQUIRED,
                'Game ID to process',
                null
            );
    }

    /**
     * execute() function
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $gameId = $input->getOption('game-id');
        if (!$gameId) {
            $output->writeln('game-id OPTION IS REQUIRED!');
            return;
        }

        $this->em = $this->getContainer()->get('doctrine.orm.entity_manager');
        // Get the Game
        $game = $this->getGame($gameId);
        if (!$game) {
            $output->writeln('Game not found for ID '.$gameId.'!');
        }

        if ($game->getFinished()) {
            // Get Predictions
            $predictions = $this->getPredictions($gameId);
            if (count($predictions)) {
                foreach ($predictions as $k => $prediction) {
                    $output->writeln('Processing Prediction ID '.$prediction->getId().'...');
                    $this->processPrediction($game, $prediction);
                }

                // Update "Memberships" table
                if (count($this->involvedFantasyTournaments)) {
                    $output->writeln('Calculating positions...');
                    $this->calculatePositions();
                }

                // Flush processed predictions
                $this->em->flush();

            } else {
                $output->writeln('There are not Predictions for Game ID '.$gameId.'!');
            }
        } else {
            $output->writeln('Game ID '.$gameId.' is not finished yet!');
        }
    }

    /**
     * getGame() function
     * @param integer $gameId
     */
    private function getGame($gameId)
    {
        $query = $this->em->createQuery('SELECT g FROM AppBundle:Game g WHERE g.id = :gameId')
            ->setParameter('gameId', $gameId);
        $game = $query->getOneOrNullResult();

        return $game;
    }

    /**
     * getPredictions() function
     * @param integer $gameId
     */
    private function getPredictions($gameId)
    {
        $query = $this->em->createQuery('SELECT p, ft FROM AppBundle:Prediction p
            LEFT JOIN p.fantasyTournament ft WHERE p.game = :gameId')
            ->setParameter('gameId', $gameId);
        $predictions = $query->getResult();

        return $predictions;
    }

    /**
     * processPrediction() function
     */
    private function processPrediction($game, $prediction)
    {
        $points = 0;
        $match = ((($game->getGoalsHome() > $game->getGoalsAway()) && ($prediction->getGoalsHome() > $prediction->getGoalsAway())) || (($game->getGoalsHome() < $game->getGoalsAway()) && ($prediction->getGoalsHome() < $prediction->getGoalsAway())) || (($game->getGoalsHome() == $game->getGoalsAway()) && ($prediction->getGoalsHome() == $prediction->getGoalsAway())));
        if ($match) {
            $prediction->setHit(true);
            $points += $prediction->getFantasyTournament()->getPointsPerGame();
            // Match exactly?
            if ($prediction->getFantasyTournament()->getMatchExact() && $game->getGoalsHome() === $prediction->getGoalsHome() && $game->getGoalsAway() === $prediction->getGoalsAway()) {
                    $prediction->setHitExact(true);
                    $points += $prediction->getFantasyTournament()->getPointsPerExact();
            }
        }

        $prediction->setProcessed(true);
        $prediction->setUpdatedAt(new \DateTime());

        if ($points > 0) {
            $query = $this->em->createQuery(
                'UPDATE AppBundle:Membership m
                    SET m.points = m.points + :points, m.matches = m.matches + 1
                    WHERE m.user = :user AND m.fantasyTournament = :ft'
                )
                ->setParameter('points', $points)
                ->setParameter('user', $prediction->getUser()->getId())
                ->setParameter('ft', $prediction->getFantasyTournament()->getId());
            $query->execute();
        }

        // Track which FantasyTournament we should update
        if (!in_array($prediction->getFantasyTournament()->getId(), $this->involvedFantasyTournaments)) {
            $this->involvedFantasyTournaments[] = $prediction->getFantasyTournament()->getId();
        }

        return;
    }

    /**
     * calculatePositions()
     */
    private function calculatePositions()
    {
        foreach ($this->involvedFantasyTournaments as $k => $ftId) {
            $query = $this->em->createQuery('SELECT m FROM AppBundle:Membership m
                WHERE m.fantasyTournament = :ftId ORDER BY m.points DESC')
                ->setParameter('ftId', $ftId);
            $members = $query->getResult();

            if (count($members)) {
                $pos = 1;
                foreach ($members as $k => $member) {
                    $member->setPrevPosition($member->getPosition());
                    $member->setPosition($pos);
                    $pos++;
                }
            }
        }

        return;
    }
}
