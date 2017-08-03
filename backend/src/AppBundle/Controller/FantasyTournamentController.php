<?php
namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\View\View;

use AppBundle\Entity\User;
use AppBundle\Entity\FantasyTournament;
use AppBundle\Form\FantasyTournamentType;

class FantasyTournamentController extends FOSRestController
{
    /**
     * @Rest\Get("/fantasy-tournaments")
     */
    public function findGlobalAction(Request $request)
    {
        $defaultLimit = $this->container->getParameter('api.max_results_default');
        $findParams = array();
        $allowedSearchProperties = array('invitation_hash');
        $propertyMapper = array('invitation_hash' => 'invitationHash');
        foreach ($allowedSearchProperties as $property) {
            if ($request->query->get($property)) {
                $findParams[$propertyMapper[$property]] = $request->query->get($property);
            }
        }
        $result = $this->getDoctrine()->getRepository('AppBundle:FantasyTournament')->findBy(
            $findParams,
            array(),
            $defaultLimit
        );
        if ($result === null || count($result) === 0) {
            throw new HttpException(404, 'Fantasy Tournaments Not Found');
        }

        return $result;
    }

    /*** Based on User ***/

    /**
     * @Rest\Get("/users/{id}/fantasy-tournaments")
     */
    public function getAction($id, Request $request)
    {
        $defaultLimit = $this->container->getParameter('api.max_results_default');
        $params = array('member_id' => $id, 'owned' => $request->query->get('owned'));

        return $this->find($params, $defaultLimit);
    }

    /**
     * @Rest\Get("/users/{id}/fantasy-tournaments/{slug}", name="get_fantasy_tournament")
     */
    public function slugAction($id, $slug)
    {
        $params = array('member_id' => $id, 'owned' => null, 'slug' => $slug);

        return $this->find($params);
    }

    /**
     * find() protected method
     * @param array $params
     * @param integer $limit
     */
    protected function find($params, $limit = 1)
    {
        // Check if it's a valid User
        $user = $this->getDoctrine()->getRepository('AppBundle:User')
            ->findOneById($params['member_id']);
        if ($user === null) {
            throw new HttpException(404, 'User not found');
        }

        $owned = (isset($params['owned']))? $params['owned'] : false;
        $repository = $this->getDoctrine()->getRepository('AppBundle:FantasyTournament');
        if ($owned) {
            $result = $repository->findBy(array('owner' => $user), array(), $limit);
        } else {
            $findParams = array('member_id' => $user->getId());
            if (isset($params['slug'])) {
                $findParams['slug'] = $params['slug'];
            }
            $result = $repository->findByMembership($findParams, array(), $limit);
        }

        if ($result === null || count($result) === 0) {
            throw new HttpException(404, 'There are no fantasy tournament exist');
        }

        return $result;
    }

    /**
     * @Rest\Post("/users/{id}/fantasy-tournaments")
     */
    public function newAction(User $user, Request $request)
    {
        $fantasyTournament = new FantasyTournament();
        $fantasyTournament->setOwner($user);

        return $this->processForm($fantasyTournament, $request);
    }

    /**
     * @Rest\Put("/users/{id}/fantasy-tournaments/{slug}")
     */
    public function editAction(User $user, Request $request, $slug)
    {
        $fantasyTournament = $this->getDoctrine()->getRepository('AppBundle:FantasyTournament')
            ->findOneBySlug($slug);

        if (!$fantasyTournament) {
            throw new HttpException(404, 'Fantasy Tournament not found');
        }

        return $this->processForm($fantasyTournament, $request);
    }

    /**
     * processForm() private method
     * @param FantasyTournament $fantasyTournament
     * @param Request $request
     */
    private function processForm(FantasyTournament $fantasyTournament, Request $request)
    {
        $statusCode = $fantasyTournament->isNew() ? 201 : 204;

        $form = $this->createForm(FantasyTournamentType::class, $fantasyTournament);
        $form->handleRequest($request);
        if ($request->getMethod() === 'PUT' && !$form->isSubmitted()) {
            $form->submit($request->request->get($form->getName()));
        }

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getEntityManager();
            $em->persist($fantasyTournament);
            $em->flush();

            $response = new Response();
            $response->setStatusCode($statusCode);

            // set the `Location` header only when creating new resources
            if (201 === $statusCode) {
                $response->headers->set('Location',
                    $this->generateUrl(
                        'get_fantasy_tournament',
                        array(
                            'id' => $fantasyTournament->getOwner()->getId(),
                            'slug' => $fantasyTournament->getSlug()
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
     * @Rest\Delete("/users/{id}/fantasy-tournaments/{slug}")
     * @Rest\View(statusCode=204)
     */
    public function removeAction(User $user, $slug)
    {
        $fantasyTournament = $this->getDoctrine()->getRepository('AppBundle:FantasyTournament')
            ->findOneBySlug($slug);

        if (!$fantasyTournament) {
            throw new HttpException(404, 'Fantasy Tournament not found');
        }

        if ($fantasyTournament->getOwner()->getId() === $user->getId()) {
            $em = $this->getDoctrine()->getEntityManager();
            $em->remove($fantasyTournament);
            $em->flush();
        } else {
            throw new HttpException(403, 'Fantasy Tournament not owned by user');
        }
    }

    /**
     * @Rest\Link("/users/{id}/fantasy-tournaments/{slug}")
     * @Rest\View(statusCode=204)
     */
    public function linkAction(User $user, $slug, Request $request)
    {
        $this->commonLinkUnlink('link', $user, $slug, $request);
    }

    /**
     * @Rest\Unlink("/users/{id}/fantasy-tournaments/{slug}")
     * @Rest\View(statusCode=204)
     */
    public function unlinkAction(User $user, $slug, Request $request)
    {
        $this->commonLinkUnlink('unlink', $user, $slug, $request);
    }

    /**
     * commonLinkUnlink() function
     */
    private function commonLinkUnlink($method, User $user, $slug, Request $request)
    {
        if (!$request->attributes->has($method . 's')) {
            throw new HttpException(400);
        }

        $fantasyTournament = $this->getDoctrine()->getRepository('AppBundle:FantasyTournament')
            ->findOneBySlug($slug);

        if (!$fantasyTournament) {
            throw new HttpException(404, 'Fantasy Tournament not found');
        }

        foreach ($request->attributes->get($method . 's') as $u) {
            if (!$u instanceof User) {
                throw new HttpException(404, 'Invalid resource');
            }

            $contains = $fantasyTournament->getMembers()->contains($u);
            if ($method === 'link') {
                if ($contains) {
                    throw new HttpException(409, 'User is already a member of the Fantasy Tournament');
                }

                $fantasyTournament->addMember($u);

            } elseif ($method === 'unlink') {
                if (!$contains) {
                    throw new HttpException(409, 'User is not a member of the Fantasy Tournament');
                }

                $fantasyTournament->removeMember($u);
            }
        }

        $em = $this->getDoctrine()->getEntityManager();
        $em->persist($fantasyTournament);
        $em->flush();
    }
}
