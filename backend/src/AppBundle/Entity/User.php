<?php

namespace AppBundle\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="AppBundle\Repository\UserRepository")
 * @ORM\Table(name="users")
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=255, name="facebook_id")
     */
    protected $facebookId;

    /**
     * @ORM\Column(type="string", length=1000, name="profile_picture_url", nullable=true)
     */
    protected $profilePictureUrl;


    public function __construct()
    {
        parent::__construct();
        $this->enabled = true;
    }

    /**
     * isNew() method
     */
    public function isNew()
    {
        return is_null($this->id);
    }

    /**
     * Set facebookId
     *
     * @param string $facebookId
     *
     * @return User
     */
    public function setFacebookId($facebookId)
    {
        $this->facebookId = $facebookId;

        return $this;
    }

    /**
     * Get facebookId
     *
     * @return string
     */
    public function getFacebookId()
    {
        return $this->facebookId;
    }

    /**
     * Set profilePictureUrl
     *
     * @param string $profilePictureUrl
     *
     * @return User
     */
    public function setProfilePictureUrl($profilePictureUrl)
    {
        $this->profilePictureUrl = $profilePictureUrl;

        return $this;
    }

    /**
     * Get profilePictureUrl
     *
     * @return string
     */
    public function getProfilePictureUrl()
    {
        return $this->profilePictureUrl;
    }
}
