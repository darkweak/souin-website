<?php

declare(strict_types=1);

namespace App\Decorator;

use ApiPlatform\Serializer\SerializerContextBuilderInterface;
use App\Entity\Domain;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

final class AdminContextBuilder implements SerializerContextBuilderInterface
{
    private SerializerContextBuilderInterface $decorated;
    private AuthorizationCheckerInterface $authorizationChecker;

    public function __construct(SerializerContextBuilderInterface $decorated, AuthorizationCheckerInterface $authorizationChecker)
    {
        $this->decorated = $decorated;
        $this->authorizationChecker = $authorizationChecker;
    }

    /**
     * @param array<mixed>|null $extractedAttributes
     *
     * @return array<mixed>
     */
    public function createFromRequest(Request $request, bool $normalization, $extractedAttributes = null): array
    {
        $context = $this->decorated->createFromRequest($request, $normalization, $extractedAttributes);
        if (Request::METHOD_PATCH === $request->getMethod() && $this->authorizationChecker->isGranted('ROLE_ADMIN')) {
            if (!is_array($context['groups'])) {
                $context['groups'] = [$context['groups']];
            }
            // Add `admin:update_user_normalization` for normalization requests
            // Otherwise, add `admin:update_user_denormalization` for denormalization requests
            $context['groups'][] = $normalization ? 'admin:create_update_user_normalization' : 'admin:create_update_user_denormalization';
        }

        $resourceClass = $context['resource_class'] ?? null;
        if (Request::METHOD_PATCH === $request->getMethod() && $resourceClass === Domain::class && \getenv('TRUSTED_MIDDLEWARE') === $request->getHost() && !$normalization) {
            if (!is_array($context['groups'])) {
                $context['groups'] = [$context['groups']];
            }
            $context['groups'][] = 'middleware:update:domain_denormalization';
        }
        if (Request::METHOD_GET === $request->getMethod() && $resourceClass === Domain::class && \getenv('TRUSTED_MIDDLEWARE') === $request->getHost() && $normalization) {
            if (!is_array($context['groups'])) {
                $context['groups'] = [$context['groups']];
            }
            $context['groups'][] = 'middleware:get:domain_normalization';
        }

        return $context;
    }
}
