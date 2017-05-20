<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\User',
            'csrf_protection'   => false
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('username', null, array('required' => true));
        $builder->add('email', EmailType::class, array('required' => true));
        $builder->add('password', PasswordType::class, array('required' => true));
        $builder->add('facebookId', null, array('required' => false));
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'user';
    }
}
