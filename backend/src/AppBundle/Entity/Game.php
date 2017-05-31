<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Game
 *
 * @ORM\Table(name="games")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\GameRepository")
 */
class Game
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
     * One Game belongs to One Tournament.
     * @ORM\ManyToOne(targetEntity="Tournament")
     * @ORM\JoinColumn(name="tournament_id", referencedColumnName="id")
     */
    private $tournament;

    /**
     * One Game has One Home Team.
     * @ORM\ManyToOne(targetEntity="Team")
     * @ORM\JoinColumn(name="team_home_id", referencedColumnName="id")
     */
    private $teamHome;

    /**
     * One Game has One Away Team.
     * @ORM\ManyToOne(targetEntity="Team")
     * @ORM\JoinColumn(name="team_away_id", referencedColumnName="id")
     */
    private $teamAway;

    /**
     * @var int
     *
     * @ORM\Column(name="goalsHome", type="integer", nullable=true)
     */
    private $goalsHome;

    /**
     * @var int
     *
     * @ORM\Column(name="goalsAway", type="integer", nullable=true)
     */
    private $goalsAway;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="playDateAt", type="datetime")
     */
    private $playDateAt;

    /**
     * @var bool
     *
     * @ORM\Column(name="finished", type="boolean")
     */
    private $finished;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->setPlayDateAt(new \DateTime('now'));
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
     * Set goalsHome
     *
     * @param integer $goalsHome
     *
     * @return Game
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
     * @return Game
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
     * Set playDateAt
     *
     * @param \DateTime $playDateAt
     *
     * @return Game
     */
    public function setPlayDateAt($playDateAt)
    {
        $this->playDateAt = $playDateAt;
        $this->playDateAt->setTimeZone(new \DateTimeZone('UTC'));

        return $this;
    }

    /**
     * Get playDateAt
     *
     * @return \DateTime
     */
    public function getPlayDateAt()
    {
        $converted = new \DateTime(
            $this->playDateAt->format('Y-m-d H:i:s'),
            new \DateTimeZone('UTC')
        );
        $converted->setTimeZone(new \DateTimeZone('America/Argentina/Cordoba'));

        return $converted;
    }

    /**
     * Set finished
     *
     * @param boolean $finished
     *
     * @return Game
     */
    public function setFinished($finished)
    {
        $this->finished = $finished;

        return $this;
    }

    /**
     * Get finished
     *
     * @return bool
     */
    public function getFinished()
    {
        return $this->finished;
    }

    /**
     * Set tournament
     *
     * @param \AppBundle\Entity\Tournament $tournament
     *
     * @return Game
     */
    public function setTournament(\AppBundle\Entity\Tournament $tournament = null)
    {
        $this->tournament = $tournament;

        return $this;
    }

    /**
     * Get tournament
     *
     * @return \AppBundle\Entity\Tournament
     */
    public function getTournament()
    {
        return $this->tournament;
    }

    /**
     * Set teamHome
     *
     * @param \AppBundle\Entity\Team $teamHome
     *
     * @return Game
     */
    public function setTeamHome(\AppBundle\Entity\Team $teamHome = null)
    {
        $this->teamHome = $teamHome;

        return $this;
    }

    /**
     * Get teamHome
     *
     * @return \AppBundle\Entity\Team
     */
    public function getTeamHome()
    {
        return $this->teamHome;
    }

    /**
     * Set teamAway
     *
     * @param \AppBundle\Entity\Team $teamAway
     *
     * @return Game
     */
    public function setTeamAway(\AppBundle\Entity\Team $teamAway = null)
    {
        $this->teamAway = $teamAway;

        return $this;
    }

    /**
     * Get teamAway
     *
     * @return \AppBundle\Entity\Team
     */
    public function getTeamAway()
    {
        return $this->teamAway;
    }

    /**
     * getVersus() method
     */
    public function getVersus()
    {
        return $this->getTeamHome()->getAlias() . ' vs ' . $this->getTeamAway()->getAlias();
    }

    /**
     * getResult() method
     */
    public function getResult()
    {
        return $this->getGoalsHome() . ' - ' . $this->getGoalsAway();
    }
}
