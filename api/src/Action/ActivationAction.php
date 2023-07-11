<?php

declare(strict_types=1);

namespace App\Action;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ActivationAction
{
    public function __construct(private EntityManagerInterface $entityManager)
    {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $content = $request->getContent();

        /** @var object{'email': string, 'token': string} */
        $json = \json_decode($content);
        $email = $json->email;
        $token = $json->token;

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email, 'token' => $token]);

        if (!$user) {
            throw new BadRequestException();
        }

        $user
            ->setToken('')
            ->setActivated(true);
        $this->entityManager->flush();

        return new JsonResponse();
    }
}
