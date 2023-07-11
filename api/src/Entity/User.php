<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\UserRepository;
use App\State\UserPasswordHasher;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\IdGenerator\UuidGenerator;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity('email')]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => 'get_user_normalization'],
            security: "is_granted('ROLE_ADMIN')",
        ),
        new Get(
            normalizationContext: ['groups' => 'get_user_normalization'],
        ),
        new Post(
            normalizationContext: ['groups' => 'create_update_user_normalization'],
            denormalizationContext: ['groups' => 'create_user_denormalization'],
            processor: UserPasswordHasher::class,
        ),
        new Patch(
            normalizationContext: ['groups' => 'create_update_user_normalization'],
            denormalizationContext: ['groups' => 'update_user_denormalization'],
            processor: UserPasswordHasher::class,
        ),
        new Delete(),
    ],
    security: "is_granted('ROLE_ADMIN') or object == user",
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    #[ORM\Column(type: UuidType::NAME)]
    private ?Uuid $id = null;

    #[Assert\NotBlank]
    #[Groups(['get_user_normalization', 'create_update_user_normalization', 'create_user_denormalization'])]
    #[ORM\Column(length: 180, unique: true)]
    private string $email = '';

    /** @var array<string> */
    #[Assert\NotBlank]
    #[Groups(['get_user_normalization', 'admin:create_update_user_denormalization', 'admin:create_update_user_normalization'])]
    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column]
    #[Assert\NotBlank]
    #[Groups(['create_user_denormalization', 'update_user_denormalization'])]
    private string $password = '';

    #[Assert\NotBlank]
    #[Groups(['get_user_normalization', 'create_update_user_normalization', 'create_user_denormalization', 'update_user_denormalization'])]
    #[ORM\Column(length: 100)]
    private string $lastname = '';

    #[Assert\NotBlank]
    #[Groups(['get_user_normalization', 'create_update_user_normalization', 'create_user_denormalization', 'update_user_denormalization'])]
    #[ORM\Column(length: 100)]
    private string $firstname = '';

    #[Groups(['get_user_normalization', 'create_update_user_normalization', 'create_user_denormalization', 'update_user_denormalization'])]
    #[ORM\Column(length: 150, nullable: true)]
    private string $company = '';

    /** @var Collection<int, Domain> */
    #[Groups(['get_user_normalization'])]
    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: Domain::class, orphanRemoval: true)]
    private Collection $domains;

    #[ORM\Column(length: 128)]
    private ?string $token = '';

    #[Groups(['get_user_normalization', 'create_update_user_normalization'])]
    #[ORM\Column]
    private bool $activated = false;

    public function __construct()
    {
        $this->domains = new ArrayCollection();
        $this->roles = ['ROLE_USER'];
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getUserIdentifier(): string
    {
        return $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /** @param array<string> $roles */
    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function eraseCredentials(): void
    {
    }

    public function getLastname(): string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getFirstname(): string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getCompany(): string
    {
        return $this->company;
    }

    public function setCompany(string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection<int, Domain>
     */
    public function getDomains(): Collection
    {
        return $this->domains;
    }

    public function addDomain(Domain $domain): self
    {
        if (!$this->domains->contains($domain)) {
            $this->domains->add($domain);
            $domain->setOwner($this);
        }

        return $this;
    }

    public function removeDomain(Domain $domain): self
    {
        $this->domains->removeElement($domain);

        return $this;
    }

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(?string $token): self
    {
        $this->token = $token;

        return $this;
    }

    public function isActivated(): bool
    {
        return $this->activated;
    }

    public function setActivated(bool $activated): self
    {
        $this->activated = $activated;

        return $this;
    }
}
