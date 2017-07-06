<?php
namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;

class GameController extends FOSRestController
{
    /**
     * @Rest\Get("/users/{id}/fantasy-tournaments/{slug}/games")
     */
    public function getAction($id, $slug, Request $request)
    {
        // Check if it's a valid User
        $user = $this->getDoctrine()->getRepository('AppBundle:User')
            ->findOneById($id);
        if ($user === null) {
            throw new HttpException(404, 'User not found');
        }

        // Check if FantasyTournament is valid
        $ft = $this->getDoctrine()->getRepository('AppBundle:FantasyTournament')
            ->findOneBy(array('slug' => $slug));
        if ($ft === null) {
            throw new HttpException(404, 'Fantasy Tournament not found');
        }

        // Get Games
        $tournament = $ft->getTournament();
        $datePattern = 'Y-m-d H:i:s';
        $now = new \DateTime();
        $now->setTimeZone(new \DateTimeZone('UTC'));
        $twoWeeksAgo = $now->modify('-2 weeks')->format($datePattern);
        $twoWeeksInAdvance = $now->modify('+4 weeks')->format($datePattern);
        $games = $this->getDoctrine()->getRepository('AppBundle:Game')
            ->findBetweenDates($tournament, $twoWeeksAgo, $twoWeeksInAdvance);

        return $games;
    }
}
