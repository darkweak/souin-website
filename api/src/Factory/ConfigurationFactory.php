<?php

declare(strict_types=1);

namespace App\Factory;

use App\Entity\Configuration;
use App\Repository\ConfigurationRepository;
use Zenstruck\Foundry\ModelFactory;
use Zenstruck\Foundry\Proxy;
use Zenstruck\Foundry\RepositoryProxy;

/**
 * @extends ModelFactory<Configuration>
 *
 * @method        Configuration|Proxy                     create(array|callable $attributes = [])
 * @method static Configuration|Proxy                     createOne(array $attributes = [])
 * @method static Configuration|Proxy                     find(object|array|mixed $criteria)
 * @method static Configuration|Proxy                     findOrCreate(array $attributes)
 * @method static Configuration|Proxy                     first(string $sortedField = 'id')
 * @method static Configuration|Proxy                     last(string $sortedField = 'id')
 * @method static Configuration|Proxy                     random(array $attributes = [])
 * @method static Configuration|Proxy                     randomOrCreate(array $attributes = [])
 * @method static ConfigurationRepository|RepositoryProxy repository()
 * @method static Configuration[]|Proxy[]                 all()
 * @method static Configuration[]|Proxy[]                 createMany(int $number, array|callable $attributes = [])
 * @method static Configuration[]|Proxy[]                 createSequence(iterable|callable $sequence)
 * @method static Configuration[]|Proxy[]                 findBy(array $attributes)
 * @method static Configuration[]|Proxy[]                 randomRange(int $min, int $max, array $attributes = [])
 * @method static Configuration[]|Proxy[]                 randomSet(int $number, array $attributes = [])
 */
final class ConfigurationFactory extends ModelFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @throws \Exception
     */
    protected function getDefaults(): array
    {
        $subdomain = ['mail', 'shop', 'blog', 'support', 'forum', 'api', 'news', 'events', 'status', 'dev'];

        return [
            'ip' => self::faker()->ipv4(),
            'zone' => $subdomain[random_int(0, count($subdomain) - 1)],
            'domain' => DomainFactory::random(),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): self
    {
        return $this
            // ->afterInstantiate(function(Configuration $configuration): void {})
        ;
    }

    protected static function getClass(): string
    {
        return Configuration::class;
    }
}
