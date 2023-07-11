<?php

namespace App\Extension;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Configuration;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\SecurityBundle\Security;

final class Configurations implements QueryCollectionExtensionInterface
{
    private Security $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * @param array<mixed> $context
     */
    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass): void
    {
        if (Configuration::class !== $resourceClass) {
            return;
        }

        if ($this->security->isGranted('ROLE_ADMIN')) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        $queryBuilder
            ->join(\sprintf('%s.domain', $rootAlias), 'd')
            ->andWhere('d.owner = :user')
            ->setParameter('user', $this->security->getUser());
    }
}
