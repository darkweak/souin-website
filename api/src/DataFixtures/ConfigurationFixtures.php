<?php

declare(strict_types=1);

namespace App\DataFixtures;

use App\Factory\ConfigurationFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class ConfigurationFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        ConfigurationFactory::createMany(
            10,
            static function (int $i) {
                return [
                    'configuration' => \sprintf('{"allowed_http_cache":["GET","HEAD"],"api":{"basepath":"/souin-api%d","prometheus":{"enabled":true,"basepath":"/prometheus"},"souin":{"basepath":"/souin"}},"cache_keys":{".*.css":{"disable_body":true,"disable_host":true,"disable_method":true,"disable_query":true,"headers":["Authorization","Content-Type"],"hide":true}},"cache_name":"Souin","default_cache_control":"public, s-maxage=86400","distributed":true,"regex":{"exclude":"url_regex_to_exclude.+"},"stale":"1d","timeout":{"backend":"10s","cache":"10ms"},"ttl":"120s"}', $i)
                ];
            }
        );

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            DomainFixtures::class,
        ];
    }
}
