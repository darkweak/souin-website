<?php

namespace App\EventListener;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\Finder\Exception\AccessDeniedException;

class JWTCreatedListener
{
    public function onJWTCreated(JWTCreatedEvent $event): void
    {
        /** @var User $user */
        $user = $event->getUser();
        if (!$user->isActivated()) {
            throw new AccessDeniedException();
        }

        $expiration = new \DateTime('+30 days');
        $payload = $event->getData();
        $payload['user_id'] = $user->getId();
        $payload['exp'] = $expiration->getTimestamp();

        $event->setData($payload);

        return;
    }
}
