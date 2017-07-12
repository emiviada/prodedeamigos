<?php
namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\View\View;

use AppBundle\Entity\Prediction;
use AppBundle\Form\PredictionType;


class PredictionController extends FOSRestController
{
    // AppBundle\Entity\FantasyTournament
    protected $fantasyTournament;

    // AppBundle\Entity\User
    protected $user;


    /**
     * validate() function
     */
    protected function validate($id, $slug, Request $request)
    {
        // Check if it's a valid User
        $this->user = $this->getDoctrine()->getRepository('AppBundle:User')
            ->findOneById($id);
        if ($this->user === null) {
            throw new HttpException(404, 'User not found');
        }

        // Check if FantasyTournament is valid
        $this->fantasyTournament = $this->getDoctrine()->getRepository('AppBundle:FantasyTournament')
            ->findOneBy(array('slug' => $slug));
        if ($this->fantasyTournament === null) {
            throw new HttpException(404, 'Fantasy Tournament not found');
        }

        return;
    }

    /**
     * @Rest\Get("/users/{id}/fantasy-tournaments/{slug}/predictions")
     */
    public function getAction($id, $slug, Request $request)
    {
        // Common validation
        $this->validate($id, $slug, $request);

        // Get Predictions
        $datePattern = 'Y-m-d H:i:s';
        $now = new \DateTime();
        $now->setTimeZone(new \DateTimeZone('UTC'));
        $oneMonthAgo = $now->modify('-1 month')->format($datePattern);
        $predictions = $this->getDoctrine()->getRepository('AppBundle:Prediction')
            ->findByFantasyTournamentAndUser($this->fantasyTournament, $this->user, $oneMonthAgo);

        return $predictions;
    }

    /**
     * @Rest\Get("/users/{id}/fantasy-tournaments/{slug}/predictions/{predictionId}", name="get_prediction")
     */
    public function idAction($id, $slug, $predictionId, Request $request)
    {
        // Common validation
        $this->validate($id, $slug, $request);

        $result = $this->getDoctrine()->getRepository('AppBundle:Prediction')
            ->findOneById($predictionId);

        if ($result === null) {
            throw new HttpException(404, 'Prediction not found');
        }

        return $result;
    }

    /**
     * @Rest\Post("/users/{id}/fantasy-tournaments/{slug}/predictions")
     */
    public function newAction($id, $slug, Request $request)
    {
        // Common validation
        $this->validate($id, $slug, $request);
        $prediction = new Prediction();
        $prediction->setFantasyTournament($this->fantasyTournament);
        $prediction->setUser($this->user);

        return $this->processForm($prediction, $request);
    }

    /**
     * @Rest\Put("/users/{id}/fantasy-tournaments/{slug}/predictions/{predictionId}")
     */
    public function editAction($id, $slug, $predictionId, Request $request)
    {
        // Common validation
        $this->validate($id, $slug, $request);

        // Get the Prediction
        $prediction = $this->getDoctrine()->getRepository('AppBundle:Prediction')
            ->findOneById($predictionId);
        if (is_null($prediction)) {
            throw new HttpException(404, 'Prediction not found');
        }

        return $this->processForm($prediction, $request);
    }

    /**
     * processForm() private method
     * @param Prediction $prediction
     * @param Request $request
     */
    private function processForm(Prediction $prediction, Request $request)
    {
        $statusCode = $prediction->isNew() ? 201 : 204;

        $form = $this->createForm(PredictionType::class, $prediction);
        $form->handleRequest($request);
        if ($request->getMethod() === 'PUT' && !$form->isSubmitted()) {
            $requestData = $request->request->get($form->getName());
            $requestData['game'] = $prediction->getGame()->getId();
            $form->submit($requestData);
        }

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getEntityManager();
            $em->persist($prediction);
            $em->flush();

            $response = new Response();
            $response->setStatusCode($statusCode);

            // set the `Location` header only when creating new resources
            if (201 === $statusCode) {
                $response->headers->set('Location',
                    $this->generateUrl(
                        'get_prediction', array(
                            'id' => $prediction->getUser()->getId(),
                            'slug' => $prediction->getFantasyTournament()->getSlug(),
                            'predictionId' => $prediction->getId()
                        ),
                        true // absolute
                    )
                );
            }

            return $response;
        }

        return View::create($form, 400);
    }

    /**
     * @Rest\Delete("/users/{id}/fantasy-tournaments/{slug}/predictions/{predictionId}")
     * @Rest\View(statusCode=204)
     */
    public function removeAction($id, $slug, $predictionId, Request $request)
    {
        // Common validation
        $this->validate($id, $slug, $request);

        // Get the Prediction
        $prediction = $this->getDoctrine()->getRepository('AppBundle:Prediction')
            ->findOneById($predictionId);
        if (is_null($prediction)) {
            throw new HttpException(404, 'Prediction not found');
        }

        if ($prediction->getUser()->getId() === $this->user->getId()) {
            $em = $this->getDoctrine()->getEntityManager();
            $em->remove($prediction);
            $em->flush();
        } else {
            throw new HttpException(403, 'Prediction not owned by user');
        }
    }
}
