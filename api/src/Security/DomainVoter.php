<?php

namespace App\Security;

use App\Entity\Domain;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class DomainVoter extends Voter
{
    public const EDIT = 'PATCH_EDIT';

    public function __construct(private RequestStack $request)
    {
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT]) && $subject instanceof Domain;
    }
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        switch ($attribute) {
            case self::EDIT:
                return $this->request->getMainRequest()?->getHost() === \getenv('TRUSTED_MIDDLEWARE') && \is_null($token->getUser());
        }
        return false;
    }
}
