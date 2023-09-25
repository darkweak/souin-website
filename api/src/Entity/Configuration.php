<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Constraints\Hostname;
use App\Repository\ConfigurationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\IdGenerator\UuidGenerator;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ConfigurationRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            security: "is_granted('ROLE_USER')",
        ),
        new Get(
            security: "is_granted('ROLE_ADMIN') or object.getDomain().getOwner() == user",
        ),
        new Post(
            normalizationContext: ['groups' => 'create_configuration_normalization'],
            denormalizationContext: ['groups' => 'create_configuration_denormalization'],
            securityPostDenormalize: "is_granted('ROLE_ADMIN') or object.getDomain().getOwner() == user",
        ),
        new Patch(
            normalizationContext: ['groups' => 'update_configuration_normalization'],
            denormalizationContext: ['groups' => 'update_configuration_denormalization'],
            security: "is_granted('ROLE_ADMIN') or object.getDomain().getOwner() == user",
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN') or object.getDomain().getOwner() == user",
        ),
    ],
    normalizationContext: ['groups' => 'get_configuration_normalization'],
)]
class Configuration
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    #[ORM\Column(type: UuidType::NAME)]
    private ?Uuid $id = null;

    #[Assert\NotBlank]
    #[Groups(['get_configuration_normalization', 'create_configuration_normalization', 'create_configuration_denormalization', 'update_configuration_normalization', 'update_configuration_denormalization', 'middleware:get:domain_normalization'])]
    #[ORM\Column(length: 100)]
    private string $zone = '';

    #[Assert\NotBlank]
    #[Groups(['get_configuration_normalization', 'create_configuration_normalization', 'create_configuration_denormalization', 'update_configuration_normalization', 'update_configuration_denormalization', 'middleware:get:domain_normalization'])]
    #[ORM\Column(type: Types::TEXT)]
    private string $configuration = '';

    #[Assert\NotBlank]
    #[Groups(['get_configuration_normalization', 'create_configuration_normalization', 'create_configuration_denormalization', 'update_configuration_normalization', 'update_configuration_denormalization', 'middleware:get:domain_normalization'])]
    #[Assert\AtLeastOneOf([
        new Assert\Ip(),
        new Hostname(message: 'The server name must be a valid hostname.')
    ])]
    #[ORM\Column(length: 39)]
    private string $ip = '';

    #[Assert\NotBlank]
    #[Groups(['get_configuration_normalization', 'create_configuration_normalization', 'update_configuration_normalization', 'create_configuration_denormalization'])]
    #[ORM\ManyToOne(inversedBy: 'configurations')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Domain $domain = null;

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getZone(): string
    {
        return $this->zone;
    }

    public function setZone(string $zone): self
    {
        $this->zone = $zone;

        return $this;
    }

    public function getConfiguration(): string
    {
        return $this->configuration;
    }

    public function setConfiguration(string $configuration): self
    {
        $this->configuration = $configuration;

        return $this;
    }

    public function getIp(): string
    {
        return $this->ip;
    }

    public function setIp(string $ip): self
    {
        $this->ip = $ip;

        return $this;
    }

    public function getDomain(): ?Domain
    {
        return $this->domain;
    }

    public function setDomain(Domain $domain): self
    {
        $this->domain = $domain;

        return $this;
    }
}
