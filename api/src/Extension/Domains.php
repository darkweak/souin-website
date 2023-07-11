<?php

namespace App\Extension;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Domain;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;

final class Domains implements QueryCollectionExtensionInterface
{
    private Security $security;

    public function __construct(Security $security, private RequestStack $request)
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
        if (Domain::class !== $resourceClass) {
            return;
        }

        if (
            $this->security->isGranted('ROLE_ADMIN') ||
            ($this->request->getMainRequest()?->getHost() === \getenv('TRUSTED_MIDDLEWARE') && \is_null($this->security->getUser()))
        ) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        $queryBuilder
            ->andWhere(sprintf('%s.owner = :user', $rootAlias))
            ->setParameter('user', $this->security->getUser());
    }
}
