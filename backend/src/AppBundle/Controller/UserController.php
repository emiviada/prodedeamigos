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
    public function getAction()
    {
        $defaultLimit = $this->container->getParameter('api.max_results_default');
        $result = $this->getDoctrine()->getRepository('AppBundle:User')->findBy(
            array(),
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
}
