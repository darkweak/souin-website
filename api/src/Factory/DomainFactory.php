<?php

declare(strict_types=1);

namespace App\Factory;

use App\Entity\Domain;
use App\Repository\DomainRepository;
use Zenstruck\Foundry\ModelFactory;
use Zenstruck\Foundry\Proxy;
use Zenstruck\Foundry\RepositoryProxy;

/**
 * @extends ModelFactory<Domain>
 *
 * @method        Domain|Proxy                     create(array|callable $attributes = [])
 * @method static Domain|Proxy                     createOne(array $attributes = [])
 * @method static Domain|Proxy                     find(object|array|mixed $criteria)
 * @method static Domain|Proxy                     findOrCreate(array $attributes)
 * @method static Domain|Proxy                     first(string $sortedField = 'id')
 * @method static Domain|Proxy                     last(string $sortedField = 'id')
 * @method static Domain|Proxy                     random(array $attributes = [])
 * @method static Domain|Proxy                     randomOrCreate(array $attributes = [])
 * @method static DomainRepository|RepositoryProxy repository()
 * @method static Domain[]|Proxy[]                 all()
 * @method static Domain[]|Proxy[]                 createMany(int $number, array|callable $attributes = [])
 * @method static Domain[]|Proxy[]                 createSequence(iterable|callable $sequence)
 * @method static Domain[]|Proxy[]                 findBy(array $attributes)
 * @method static Domain[]|Proxy[]                 randomRange(int $min, int $max, array $attributes = [])
 * @method static Domain[]|Proxy[]                 randomSet(int $number, array $attributes = [])
 */
final class DomainFactory extends ModelFactory
{
    public function __construct()
    {
        parent::__construct();
    }

    protected function getDefaults(): array
    {
        return [
            'dns' => self::faker()->domainName(),
            'owner' => UserFactory::random(),
            'valid' => self::faker()->boolean(),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): self
    {
        return $this
            // ->afterInstantiate(function(Domain $domain): void {})
        ;
    }

    protected static function getClass(): string
    {
        return Domain::class;
    }
}
