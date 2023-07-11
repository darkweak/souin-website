<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230606075306 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE configuration (id UUID NOT NULL, domain_id UUID NOT NULL, zone VARCHAR(100) NOT NULL, configuration TEXT NOT NULL, ip VARCHAR(39) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_A5E2A5D7115F0EE5 ON configuration (domain_id)');
        $this->addSql('COMMENT ON COLUMN configuration.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN configuration.domain_id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE domain (id UUID NOT NULL, owner_id UUID NOT NULL, dns VARCHAR(255) NOT NULL, valid BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_A7A91E0B7E3C61F9 ON domain (owner_id)');
        $this->addSql('COMMENT ON COLUMN domain.id IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN domain.owner_id IS \'(DC2Type:uuid)\'');
        $this->addSql('CREATE TABLE "user" (id UUID NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, lastname VARCHAR(100) NOT NULL, firstname VARCHAR(100) NOT NULL, company VARCHAR(150) DEFAULT NULL, token VARCHAR(128) NOT NULL, activated BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('COMMENT ON COLUMN "user".id IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE configuration ADD CONSTRAINT FK_A5E2A5D7115F0EE5 FOREIGN KEY (domain_id) REFERENCES domain (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE domain ADD CONSTRAINT FK_A7A91E0B7E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE configuration DROP CONSTRAINT FK_A5E2A5D7115F0EE5');
        $this->addSql('ALTER TABLE domain DROP CONSTRAINT FK_A7A91E0B7E3C61F9');
        $this->addSql('DROP TABLE configuration');
        $this->addSql('DROP TABLE domain');
        $this->addSql('DROP TABLE "user"');
    }
}
