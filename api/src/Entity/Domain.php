<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\DomainRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\IdGenerator\UuidGenerator;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: DomainRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => 'get_domain_normalization'],
        ),
        new Get(
            normalizationContext: ['groups' => 'get_domain_normalization'],
            paginationEnabled: false,
        ),
        new Post(
            normalizationContext: ['groups' => 'create_domain_normalization'],
            denormalizationContext: ['groups' => 'create_domain_denormalization'],
        ),
        new Patch(
            normalizationContext: ['groups' => 'update_domain_normalization'],
            denormalizationContext: ['groups' => 'update_domain_denormalization'],
            security: "is_granted('PATCH_EDIT', object) or is_granted('ROLE_ADMIN') or object.getOwner() == user"
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN') or object.getOwner() == user"
        ),
    ],
)]
#[ApiFilter(BooleanFilter::class, properties: ['valid'])]
class Domain
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    #[ORM\Column(type: UuidType::NAME)]
    private ?Uuid $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups([
        'get_domain_normalization',
        'create_domain_normalization',
        'create_domain_denormalization',
        'update_domain_normalization',
        'create_configuration_normalization',
    ])]
    private string $dns = '';

    // Removed the not blank assertion because false is considered as blank.
    #[ORM\Column]
    #[Groups([
        'get_domain_normalization',
        'create_domain_normalization',
        'update_domain_normalization',
        'middleware:update:domain_denormalization',
    ])]
    private bool $valid = false;

    #[ORM\ManyToOne(inversedBy: 'domains')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotBlank]
    private ?User $owner = null;

    /** @var Collection<int, Configuration> */
    #[ORM\OneToMany(mappedBy: 'domain', targetEntity: Configuration::class, orphanRemoval: true)]
    #[Groups(['get_domain_normalization', 'create_domain_normalization', 'update_domain_normalization', 'middleware:get:domain_normalization'])]
    private Collection $configurations;

    public function __construct()
    {
        $this->configurations = new ArrayCollection();
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getDns(): string
    {
        return $this->dns;
    }

    public function setDns(string $dns): self
    {
        $this->dns = $dns;

        return $this;
    }

    public function isValid(): bool
    {
        return $this->valid;
    }

    public function setValid(bool $valid): self
    {
        $this->valid = $valid;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(User $owner): self
    {
        $this->owner = $owner;

        return $this;
    }

    /**
     * @return Collection<int, Configuration>
     */
    public function getConfigurations(): Collection
    {
        return $this->configurations;
    }

    public function addConfiguration(Configuration $configuration): self
    {
        if (!$this->configurations->contains($configuration)) {
            $this->configurations->add($configuration);
            $configuration->setDomain($this);
        }

        return $this;
    }

    public function removeConfiguration(Configuration $configuration): self
    {
        $this->configurations->removeElement($configuration);

        return $this;
    }
}
