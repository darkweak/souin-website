<?php

declare(strict_types=1);

namespace App\Factory;

use App\Entity\User;
use App\Repository\UserRepository;
use Zenstruck\Foundry\ModelFactory;
use Zenstruck\Foundry\Proxy;
use Zenstruck\Foundry\RepositoryProxy;

/**
 * @extends ModelFactory<User>
 *
 * @method        User|Proxy                     create(array|callable $attributes = [])
 * @method static User|Proxy                     createOne(array $attributes = [])
 * @method static User|Proxy                     find(object|array|mixed $criteria)
 * @method static User|Proxy                     findOrCreate(array $attributes)
 * @method static User|Proxy                     first(string $sortedField = 'id')
 * @method static User|Proxy                     last(string $sortedField = 'id')
 * @method static User|Proxy                     random(array $attributes = [])
 * @method static User|Proxy                     randomOrCreate(array $attributes = [])
 * @method static UserRepository|RepositoryProxy repository()
 * @method static User[]|Proxy[]                 all()
 * @method static User[]|Proxy[]                 createMany(int $number, array|callable $attributes = [])
 * @method static User[]|Proxy[]                 createSequence(iterable|callable $sequence)
 * @method static User[]|Proxy[]                 findBy(array $attributes)
 * @method static User[]|Proxy[]                 randomRange(int $min, int $max, array $attributes = [])
 * @method static User[]|Proxy[]                 randomSet(int $number, array $attributes = [])
 */
final class UserFactory extends ModelFactory
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

    protected function getDefaults(): array
    {
        return [
            'email' => self::faker()->unique()->email(),
            'firstname' => self::faker()->firstName(),
            'lastname' => self::faker()->lastName(),
            // #Corresponds to 'test'
            'password' => '$2y$13$cR4usFPNkvZhiAz.44D8zujmeimzhFzXJqPaCve14IqXeRuAiHKjK',
            'roles' => ['ROLE_USER'],
            'activated' => true,
        ];
    }

    protected function initialize(): self
    {
        return $this
            // ->afterInstantiate(function(User $user): void {})
        ;
    }

    protected static function getClass(): string
    {
        return User::class;
    }
}
