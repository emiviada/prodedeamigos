<?php

namespace AppBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class FantasyTournamentType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'AppBundle\Entity\FantasyTournament',
            'csrf_protection'   => false,
            'validation_groups' => function (FormInterface $form) {
                $data = $form->getData();

                if ($data->getMatchExact()) {
                    return array('Default', 'exactly');
                }

                return array('Default');
            },
        ));
    }

    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder->add('name', null);
        $builder->add('pointsPerGame', null);
        $builder->add('tournament', EntityType::class, array(
            'class' => 'AppBundle:Tournament'
        ));
        $builder->add('matchExact', null);
        $builder->add('pointsPerExact', null);
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'fantasy_tournament';
    }
}
