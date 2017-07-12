<?php

namespace AppBundle\Repository;

/**
 * PredictionRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class PredictionRepository extends \Doctrine\ORM\EntityRepository
{
    /**
     * findByFantasyTournamentAndUser() method
     * @param AppBundle\Entity\FantasyTournament $ft
     * @param AppBundle\Entity\User $user
     * @param string $from (date string)[optional]
     */
    public function findByFantasyTournamentAndUser($fantasyTournament, $user, $from = null)
    {
        $query = $this->createQueryBuilder('p')
            ->where('p.fantasyTournament = :fantasyTournament')
            ->andWhere('p.user = :user');

        $params = array(
            'fantasyTournament' => $fantasyTournament,
            'user' => $user
        );

        if ($from) {
            $query->andWhere('p.createdAt >= :from');
            $params['from'] = $from;
        }

        $query->setParameters($params);
        $query = $query->getQuery();

        try {
            return $query->getResult();
        } catch (\Doctrine\ORM\NoResultException $e) {
            return null;
        }
    }
}