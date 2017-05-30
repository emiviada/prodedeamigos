<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Tournament
 *
 * @ORM\Table(name="tournaments")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\TournamentRepository")
 */
class Tournament
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
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, unique=true)
     */
    private $name;

    /**
     * @var bool
     *
     * @ORM\Column(name="active", type="boolean", options={"default" = true})
     */
    private $active;

    /**
     * Many Tournaments have Many Teams.
     * @ORM\ManyToMany(targetEntity="Team")
     * @ORM\JoinTable(name="tournaments_teams",
     *      joinColumns={@ORM\JoinColumn(name="tournament_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="team_id", referencedColumnName="id")}
     * )
     */
    private $teams;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->teams = new ArrayCollection();
    }

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Tournament
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set active
     *
     * @param boolean $active
     *
     * @return Tournament
     */
    public function setActive($active)
    {
        $this->active = $active;

        return $this;
    }

    /**
     * Get active
     *
     * @return bool
     */
    public function getActive()
    {
        return $this->active;
    }

    /**
     * Add team
     *
     * @param \AppBundle\Entity\Team $team
     *
     * @return Tournament
     */
    public function addTeam(\AppBundle\Entity\Team $team)
    {
        $this->teams[] = $team;

        return $this;
    }

    /**
     * Remove team
     *
     * @param \AppBundle\Entity\Team $team
     */
    public function removeTeam(\AppBundle\Entity\Team $team)
    {
        $this->teams->removeElement($team);
    }

    /**
     * Get teams
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getTeams()
    {
        return $this->teams;
    }
}
