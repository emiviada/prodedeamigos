<?php

namespace AppBundle\Entity;

use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Gedmo\Mapping\Annotation as Gedmo;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * FantasyTournament
 *
 * @ORM\Table(name="fantasy_tournaments")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\FantasyTournamentRepository")
 * @Vich\Uploadable
 */
class FantasyTournament
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
     * One FantasyTournament belongs to One Tournament.
     * @ORM\ManyToOne(targetEntity="Tournament")
     * @ORM\JoinColumn(name="tournament_id", referencedColumnName="id")
     * @Assert\NotBlank
     */
    private $tournament;

    /**
     * One FantasyTournament belongs to One User.
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="owner_id", referencedColumnName="id")
     */
    private $owner;

    /**
     * @var string
     *
     * @Assert\NotBlank
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="picture", type="string", length=255, nullable=true)
     */
    private $picture;

    /**
     * @Vich\UploadableField(mapping="fantasy_tournament_images", fileNameProperty="picture")
     * @var File
     */
    private $pictureFile;

    /**
     * @var string
     */
    private $pictureUri;

    /**
     * @var int
     *
     * @Assert\NotBlank
     * @ORM\Column(name="pointsPerGame", type="integer")
     */
    private $pointsPerGame;

    /**
     * @var bool
     *
     * @ORM\Column(name="matchExact", type="boolean", nullable=true)
     */
    private $matchExact;

    /**
     * @var int
     *
     * @Assert\NotBlank(groups={"exactly"})
     * @ORM\Column(name="pointsPerExact", type="integer", nullable=true)
     */
    private $pointsPerExact;

    /**
     * Many FantasyTournaments have Many Users.
     * @ORM\ManyToMany(targetEntity="User")
     * @ORM\JoinTable(name="fantasy_tournaments_members",
     *      joinColumns={@ORM\JoinColumn(name="fantasy_tournament_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="user_id", referencedColumnName="id")}
     * )
     */
    private $members;

    /**
     * @Gedmo\Slug(fields={"name"}, updatable=false, separator="-")
     * @ORM\Column(length=100, unique=true)
     */
    private $slug;

    /**
     * @ORM\Column(type="datetime")
     * @var \DateTime
     */
    private $updatedAt;


    /**
     * Constructor
     */
    public function __construct()
    {
        $this->members = new \Doctrine\Common\Collections\ArrayCollection();
        $this->updatedAt = new \DateTime();
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
     * @return FantasyTournament
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
     * Set pointsPerGame
     *
     * @param integer $pointsPerGame
     *
     * @return FantasyTournament
     */
    public function setPointsPerGame($pointsPerGame)
    {
        $this->pointsPerGame = $pointsPerGame;

        return $this;
    }

    /**
     * Get pointsPerGame
     *
     * @return int
     */
    public function getPointsPerGame()
    {
        return $this->pointsPerGame;
    }

    /**
     * Set matchExact
     *
     * @param boolean $matchExact
     *
     * @return FantasyTournament
     */
    public function setMatchExact($matchExact)
    {
        $this->matchExact = $matchExact;

        return $this;
    }

    /**
     * Get matchExact
     *
     * @return bool
     */
    public function getMatchExact()
    {
        return $this->matchExact;
    }

    /**
     * Set pointsPerExact
     *
     * @param integer $pointsPerExact
     *
     * @return FantasyTournament
     */
    public function setPointsPerExact($pointsPerExact)
    {
        $this->pointsPerExact = $pointsPerExact;

        return $this;
    }

    /**
     * Get pointsPerExact
     *
     * @return int
     */
    public function getPointsPerExact()
    {
        return $this->pointsPerExact;
    }

    /**
     * Set tournament
     *
     * @param \AppBundle\Entity\Tournament $tournament
     *
     * @return FantasyTournament
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
     * Set owner
     *
     * @param \AppBundle\Entity\User $owner
     *
     * @return FantasyTournament
     */
    public function setOwner(\AppBundle\Entity\User $owner = null)
    {
        $this->owner = $owner;
        // Add the owner as a member
        $this->addMember($owner);

        return $this;
    }

    /**
     * Get owner
     *
     * @return \AppBundle\Entity\User
     */
    public function getOwner()
    {
        return $this->owner;
    }

    /**
     * Add member
     *
     * @param \AppBundle\Entity\User $member
     *
     * @return FantasyTournament
     */
    public function addMember(\AppBundle\Entity\User $member)
    {
        $this->members[] = $member;

        return $this;
    }

    /**
     * Remove member
     *
     * @param \AppBundle\Entity\User $member
     */
    public function removeMember(\AppBundle\Entity\User $member)
    {
        $this->members->removeElement($member);
    }

    /**
     * Get members
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getMembers()
    {
        return $this->members;
    }

    /**
     * Set slug
     *
     * @param string $slug
     *
     * @return FantasyTournament
     */
    public function setSlug($slug)
    {
        $this->slug = $slug;

        return $this;
    }

    /**
     * Get slug
     *
     * @return string
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * isNew() method
     */
    public function isNew()
    {
        return is_null($this->id);
    }

    /**
     * setPictureFile
     * @param string $picture
     */
    public function setPictureFile(File $picture = null)
    {
        $this->pictureFile = $picture;

        // VERY IMPORTANT:
        // It is required that at least one field changes if you are using Doctrine,
        // otherwise the event listeners won't be called and the file is lost
        if ($picture) {
            // if 'updatedAt' is not defined in your entity, use another property
            $this->updatedAt = new \DateTime('now');
        }
    }

    /**
     * getPictureFile() getter
     */
    public function getPictureFile()
    {
        return $this->pictureFile;
    }

    /**
     * getPictureUri() getter
     */
    public function getPictureUri()
    {
        $this->pictureUri = ($this->getPicture())?
            \Cloudinary::cloudinary_url($this->getPicture()) : null;
        return $this->pictureUri;
    }

    /**
     * Set picture
     *
     * @param string $picture
     *
     * @return FantasyTournament
     */
    public function setPicture($picture)
    {
        $this->picture = $picture;

        return $this;
    }

    /**
     * Get picture
     *
     * @return string
     */
    public function getPicture()
    {
        return $this->picture;
    }

    /**
     * Set updatedAt
     *
     * @param \DateTime $updatedAt
     *
     * @return FantasyTournament
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * Get updatedAt
     *
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }
}
