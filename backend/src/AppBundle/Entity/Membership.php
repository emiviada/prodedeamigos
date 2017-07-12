<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Membership
 *
 * @ORM\Table(name="memberships")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\MembershipRepository")
 */
class Membership
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=false)
     */
    protected $user;

    /**
     * @ORM\ManyToOne(targetEntity="FantasyTournament", inversedBy="memberships")
     * @ORM\JoinColumn(name="fantasy_tournament_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     */
    protected $fantasyTournament;

    /**
     * @var int
     *
     * @ORM\Column(name="points", type="integer", options={"default" = 0})
     */
    private $points;

    /**
     * @var int
     *
     * @ORM\Column(name="matches", type="integer", options={"default" = 0})
     */
    private $matches;

    /**
     * @var int
     *
     * @ORM\Column(name="position", type="integer", options={"default" = 0})
     */
    private $position;

    /**
     * @var int
     *
     * @ORM\Column(name="prevPosition", type="integer", options={"default" = 0})
     */
    private $prevPosition;


    /**
     * Constructor
     */
    public function __construct()
    {
        $this->points = 0;
        $this->matches = 0;
        $this->position = 0;
        $this->prevPosition = 0;
    }

    /**
     * __toString() magic method
     */
    public function __toString()
    {
        return (string) $this->getUser()->getUsername();
    }

    /**
     * Set points
     *
     * @param integer $points
     *
     * @return Membership
     */
    public function setPoints($points)
    {
        $this->points = $points;

        return $this;
    }

    /**
     * Get points
     *
     * @return int
     */
    public function getPoints()
    {
        return $this->points;
    }

    /**
     * Set matches
     *
     * @param integer $matches
     *
     * @return Membership
     */
    public function setMatches($matches)
    {
        $this->matches = $matches;

        return $this;
    }

    /**
     * Get matches
     *
     * @return int
     */
    public function getMatches()
    {
        return $this->matches;
    }

    /**
     * Set position
     *
     * @param integer $position
     *
     * @return Membership
     */
    public function setPosition($position)
    {
        $this->position = $position;

        return $this;
    }

    /**
     * Get position
     *
     * @return int
     */
    public function getPosition()
    {
        return $this->position;
    }

    /**
     * Set prevPosition
     *
     * @param integer $prevPosition
     *
     * @return Membership
     */
    public function setPrevPosition($prevPosition)
    {
        $this->prevPosition = $prevPosition;

        return $this;
    }

    /**
     * Get prevPosition
     *
     * @return int
     */
    public function getPrevPosition()
    {
        return $this->prevPosition;
    }

    /**
     * Set user
     *
     * @param User $user
     *
     * @return Membership
     */
    public function setUser(User $user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * Set fantasyTournament
     *
     * @param FantasyTournament $fantasyTournament
     *
     * @return Membership
     */
    public function setFantasyTournament(FantasyTournament $fantasyTournament)
    {
        $this->fantasyTournament = $fantasyTournament;

        return $this;
    }

    /**
     * Get fantasyTournament
     *
     * @return \Entity\FantasyTournament
     */
    public function getFantasyTournament()
    {
        return $this->fantasyTournament;
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }
}
