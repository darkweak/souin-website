<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Factory\UserFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class UserFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        UserFactory::createOne([
            'email' => 'admin@test.fr',
            'firstname' => 'John',
            'lastname' => 'Doe',
            // Corresponds to 'test'
            'password' => '$2y$13$cR4usFPNkvZhiAz.44D8zujmeimzhFzXJqPaCve14IqXeRuAiHKjK',
            'roles' => ['ROLE_ADMIN'],
        ]);
        UserFactory::createOne([
            'email' => 'test@test.fr',
            'firstname' => 'Tester',
            'lastname' => 'Dummy',
            // Corresponds to 'test'
            'password' => '$2y$13$cR4usFPNkvZhiAz.44D8zujmeimzhFzXJqPaCve14IqXeRuAiHKjK',
            'roles' => ['ROLE_USER'],
        ]);
        UserFactory::createMany(3);

        $manager->flush();
    }
}
