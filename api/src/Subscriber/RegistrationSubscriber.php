<?php

declare(strict_types=1);

namespace App\Subscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

class RegistrationSubscriber implements EventSubscriberInterface
{
    private EntityManagerInterface $entityManager;
    private MailerInterface $mailer;
    private Environment $twig;
    private string $frontendUrl;

    public function __construct(
        EntityManagerInterface $entityManager,
        MailerInterface $mailer,
        Environment $twig,
        string $frontendUrl
    ) {
        $this->entityManager = $entityManager;
        $this->mailer = $mailer;
        $this->twig = $twig;
        $this->frontendUrl = $frontendUrl;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['handleRegistration', EventPriorities::POST_VALIDATE],
        ];
    }

    public function handleRegistration(ViewEvent $event): void
    {

        if (!($event->getControllerResult() instanceof User && Request::METHOD_POST === $event->getRequest()->getMethod())) {
            return;
        }

        /** @var User $user */
        $user = $event->getControllerResult();
        $token = hash('sha512', $user->getEmail() . (new \DateTime())->format('Y-m-d H:i:s'));

        $user->setToken($token);

        $this->entityManager->flush();

        $activationUrl = sprintf('%s/activation?email=%s&token=%s', $this->frontendUrl, $user->getEmail(), $token);

        $context = [
            'user' => $user,
            'activationUrl' => $activationUrl,
        ];

        $html = $this->twig->render('emails/registration.html.twig', $context);
        $text = $this->twig->render('emails/registration.txt.twig', $context);

        $email = (new Email())
            ->from('noreply@souin.com')
            ->to($user->getEmail())
            ->subject('Registration confirmation')
            ->text($text)
            ->html($html);

        $this->mailer->send($email);
    }
}
