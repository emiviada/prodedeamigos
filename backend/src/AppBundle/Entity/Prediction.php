<?php

namespace AppBundle\Entity;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * Prediction
 *
 * @ORM\Table(name="predictions")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\PredictionRepository")
 * @UniqueEntity(
 *     fields={"fantasyTournament", "game", "user"},
 *     message="The prediction already exists."
 * )
 */
class Prediction
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
     * One Prediction belongs to One FantasyTournament.
     * @ORM\ManyToOne(targetEntity="FantasyTournament")
     * @ORM\JoinColumn(name="fantasy_tournament_id", referencedColumnName="id")
     * @Assert\NotBlank
     */
    private $fantasyTournament;

    /**
     * One Prediction belongs to One Game.
     * @ORM\ManyToOne(targetEntity="Game")
     * @ORM\JoinColumn(name="game_id", referencedColumnName="id")
     * @Assert\NotBlank
     */
    private $game;

    /**
     * One Prediction belongs to One User.
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="CASCADE")
     * @Assert\NotBlank
     */
    private $user;

    /**
     * @var int
     *
     * @ORM\Column(name="goalsHome", type="integer")
     * @Assert\NotBlank
     */
    private $goalsHome;

    /**
     * @var int
     *
     * @ORM\Column(name="goalsAway", type="integer")
     * @Assert\NotBlank
     */
    private $goalsAway;

    /**
     * @var bool
     *
     * @ORM\Column(name="hit", type="boolean", options={"default" : false})
     */
    private $hit;

    /**
     * @var bool
     *
     * @ORM\Column(name="hitExact", type="boolean", options={"default" : false})
     */
    private $hitExact;

    /**
     * @var bool
     *
     * @ORM\Column(name="processed", type="boolean", options={"default" : false})
     */
    private $processed;

    /**
     * @var \DateTime $created
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @var \DateTime $updated
     *
     * @Gedmo\Timestampable(on="update")
     * @ORM\Column(type="datetime")
     */
    private $updatedAt;


    /**
     * Constructor
     */
    public function __construct()
    {
        $this->hit = false;
        $this->hitExact = false;
        $this->processed = false;
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
     * isNew() method
     */
    public function isNew()
    {
        return is_null($this->id);
    }

    /**
     * Set goalsHome
     *
     * @param integer $goalsHome
     *
     * @return Prediction
     */
    public function setGoalsHome($goalsHome)
    {
        $this->goalsHome = $goalsHome;

        return $this;
    }

    /**
     * Get goalsHome
     *
     * @return int
     */
    public function getGoalsHome()
    {
        return $this->goalsHome;
    }

    /**
     * Set goalsAway
     *
     * @param integer $goalsAway
     *
     * @return Prediction
     */
    public function setGoalsAway($goalsAway)
    {
        $this->goalsAway = $goalsAway;

        return $this;
    }

    /**
     * Get goalsAway
     *
     * @return int
     */
    public function getGoalsAway()
    {
        return $this->goalsAway;
    }

    /**
     * Set hit
     *
     * @param boolean $hit
     *
     * @return Prediction
     */
    public function setHit($hit)
    {
        $this->hit = $hit;

        return $this;
    }

    /**
     * Get hit
     *
     * @return bool
     */
    public function getHit()
    {
        return $this->hit;
    }

    /**
     * Set hitExact
     *
     * @param boolean $hitExact
     *
     * @return Prediction
     */
    public function setHitExact($hitExact)
    {
        $this->hitExact = $hitExact;

        return $this;
    }

    /**
     * Get hitExact
     *
     * @return bool
     */
    public function getHitExact()
    {
        return $this->hitExact;
    }

    /**
     * Set createdAt
     *
     * @param \DateTime $createdAt
     *
     * @return Prediction
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
        $this->createdAt->setTimeZone(new \DateTimeZone('UTC'));

        return $this;
    }

    /**
     * Get createdAt
     *
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        if ($this->createdAt) {
            $converted = new \DateTime(
                $this->createdAt->format('Y-m-d H:i:s'),
                new \DateTimeZone('UTC')
            );
            $converted->setTimeZone(new \DateTimeZone('America/Argentina/Cordoba'));

            return $converted;
        } else {
            return $this->createdAt;
        }
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     *
     * @return Prediction
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;
        $this->updatedAt->setTimeZone(new \DateTimeZone('UTC'));

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        if ($this->updatedAt) {
            $converted = new \DateTime(
                $this->updatedAt->format('Y-m-d H:i:s'),
                new \DateTimeZone('UTC')
            );
            $converted->setTimeZone(new \DateTimeZone('America/Argentina/Cordoba'));

            return $converted;
        } else {
            return $this->updatedAt;
        }
    }

    /**
     * Set fantasyTournament
     *
     * @param \AppBundle\Entity\FantasyTournament $fantasyTournament
     *
     * @return Prediction
     */
    public function setFantasyTournament(\AppBundle\Entity\FantasyTournament $fantasyTournament = null)
    {
        $this->fantasyTournament = $fantasyTournament;

        return $this;
    }

    /**
     * Get fantasyTournament
     *
     * @return \AppBundle\Entity\FantasyTournament
     */
    public function getFantasyTournament()
    {
        return $this->fantasyTournament;
    }

    /**
     * Set game
     *
     * @param \AppBundle\Entity\Game $game
     *
     * @return Prediction
     */
    public function setGame(\AppBundle\Entity\Game $game = null)
    {
        $this->game = $game;

        return $this;
    }

    /**
     * Get game
     *
     * @return \AppBundle\Entity\Game
     */
    public function getGame()
    {
        return $this->game;
    }

    /**
     * Set user
     *
     * @param \AppBundle\Entity\User $user
     *
     * @return Prediction
     */
    public function setUser(\AppBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \AppBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * getResult()
     */
    public function getResult()
    {
        return $this->getGoalsHome() . ' - ' . $this->getGoalsAway();
    }

    /**
     * Set processed
     *
     * @param boolean $processed
     *
     * @return Prediction
     */
    public function setProcessed($processed)
    {
        $this->processed = $processed;

        return $this;
    }

    /**
     * Get processed
     *
     * @return boolean
     */
    public function getProcessed()
    {
        return $this->processed;
    }
}
