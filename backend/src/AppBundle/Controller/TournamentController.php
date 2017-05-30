<?php
namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpKernel\Exception\HttpException;
use FOS\RestBundle\Controller\FOSRestController;

class TournamentController extends FOSRestController
{
    /**
     * @Rest\Get("/tournaments")
     */
    public function getAction(Request $request)
    {
        $defaultLimit = $this->container->getParameter('api.max_results_default');
        $findParams = array('active' => true);
        $result = $this->getDoctrine()->getRepository('AppBundle:Tournament')->findBy(
            $findParams,
            array(),
            $defaultLimit
        );
        if ($result === null) {
            throw new HttpException(404, 'There are no tournaments exist');
        }

        return $result;
    }

    /**
     * @Rest\Get("/tournaments/{id}", name="get_tournament")
     */
    public function idAction($id)
    {
        $findParams = array('active' => true, 'id' => $id);
        $result = $this->getDoctrine()->getRepository('AppBundle:Tournament')->findOneBy(
            $findParams
        );
        if ($result === null) {
            throw new HttpException(404, 'Tournament not found');
        }

        return $result;
    }
}
