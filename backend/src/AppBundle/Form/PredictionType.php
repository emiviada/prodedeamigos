<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PredictionType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\Prediction',
            'csrf_protection'   => false,
            'validation_groups' => function (FormInterface $form) {
                return array('Default');
            }
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('goalsHome', null, array('required' => true));
        $builder->add('goalsAway', null, array('required' => true));
        $builder->add('game', EntityType::class, array(
            'class' => 'AppBundle:Game'
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'prediction';
    }
}
