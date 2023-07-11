<?php

declare(strict_types=1);

namespace App\Action;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class ChangePasswordAction
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security $security,
        private UserPasswordHasherInterface $userPasswordHasher
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        if (!$this->security->getUser()) {
            throw new BadRequestException();
        }

        /** @var User */
        $user = $this->security->getUser();
        $content = $request->getContent();

        /** @var object{'current_password': string, 'new_password': string} */
        $json = \json_decode($content);
        $current = $json->current_password;

        if (!$this->userPasswordHasher->isPasswordValid($user, $current)) {
            return new JsonResponse(null, Response::HTTP_BAD_REQUEST);
        }

        $user->setPassword($this->userPasswordHasher->hashPassword(
            $user,
            $json->new_password
        ));
        $this->entityManager->flush();

        return new JsonResponse();
    }
}
