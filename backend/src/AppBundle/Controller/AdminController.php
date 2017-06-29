<?php

namespace AppBundle\Controller;

use JavierEguiluz\Bundle\EasyAdminBundle\Controller\AdminController as BaseAdminController;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

use AppBundle\Repository\UserRepository;

class AdminController extends BaseAdminController
{
    /**
     * prePersistFantasyTournamentEntity()
     */
    protected function prePersistFantasyTournamentEntity()
    {
        $easyadmin = $this->request->attributes->get('easyadmin');
        $entity = $easyadmin['item'];
        $this->processMembership($entity, $this->request);
    }

    /**
     * preUpdateFantasyTournamentEntity()
     */
    protected function preUpdateFantasyTournamentEntity()
    {
        $id = $this->request->query->get('id');
        $easyadmin = $this->request->attributes->get('easyadmin');
        $entity = $easyadmin['item'];
        $this->processMembership($entity, $this->request);
    }

    /**
     * processMembership()
     * @param AppBundle\Entity\FantasyTournament $entity
     * @param Symfony\Component\HttpFoundation\Request $request
     */
    private function processMembership($entity, $request)
    {
        $post = $request->request->get('fantasytournament');
        if (isset($post['members']) && isset($post['members']['autocomplete'])) {
            $memberIds = $post['members']['autocomplete'];
            // Get Users
            $members = $this->em->getRepository('AppBundle:User')->findById($memberIds);
            if (count($members)) {
                foreach ($members as $member) {
                    $entity->addMember($member);
                }
            }
        }

        return;
    }
}
