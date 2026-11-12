-- =====================================================================
-- MontaAqui: estrutura do banco de dados (MySQL 8)
-- =====================================================================
-- Gerado em 28/08/2026 a partir das migrations do Django (backend/apps/*/migrations).
-- O conteúdo é o mesmo que o comando "python manage.py migrate" cria.
--
-- COMO USAR
--   1. Rode este arquivo em um MySQL 8 (Workbench: File > Open SQL Script > Execute).
--   2. Depois, rode montaaqui_dados.sql para carregar o catálogo inicial.
--   3. No backend, aponte o .env para este banco e rode "python manage.py migrate"
--      uma vez: ele não cria nada de novo, só registra as permissões do admin.
--
-- ATENÇÃO
--   - Feito para um banco vazio. Se as tabelas já existirem, o script para com erro.
--   - Não altere tabelas por aqui: mudanças no banco devem ser feitas nos models
--     do Django e virar uma migration, para o código e o banco não ficarem diferentes.
--   - Se os models mudarem, este arquivo precisa ser gerado de novo.
-- =====================================================================

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS montaaqui
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE montaaqui;

CREATE TABLE `django_content_type` (`id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `name` varchar(100) NOT NULL, `app_label` varchar(100) NOT NULL, `model` varchar(100) NOT NULL);

ALTER TABLE `django_content_type` ADD CONSTRAINT `django_content_type_app_label_model_76bd3d3b_uniq` UNIQUE (`app_label`, `model`);

ALTER TABLE `django_content_type` MODIFY `name` varchar(100) NULL;

ALTER TABLE `django_content_type` DROP COLUMN `name`;

CREATE TABLE `auth_permission` (`id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `name` varchar(50) NOT NULL, `content_type_id` integer NOT NULL, `codename` varchar(100) NOT NULL);

CREATE TABLE `auth_group` (`id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `name` varchar(80) NOT NULL UNIQUE);
CREATE TABLE `auth_group_permissions` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `group_id` integer NOT NULL, `permission_id` integer NOT NULL);

ALTER TABLE `auth_permission` ADD CONSTRAINT `auth_permission_content_type_id_codename_01ab375a_uniq` UNIQUE (`content_type_id`, `codename`);
ALTER TABLE `auth_permission` ADD CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);
ALTER TABLE `auth_group_permissions` ADD CONSTRAINT `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` UNIQUE (`group_id`, `permission_id`);
ALTER TABLE `auth_group_permissions` ADD CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);
ALTER TABLE `auth_group_permissions` ADD CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`);


ALTER TABLE `auth_permission` MODIFY `name` varchar(255) NOT NULL;


ALTER TABLE `auth_group` MODIFY `name` varchar(150) NOT NULL;


--;
-- Create model Usuario;
--;
CREATE TABLE `usuario` (`last_login` datetime(6) NULL, `is_superuser` bool NOT NULL, `id_usuario` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `nome` varchar(150) NOT NULL, `email` varchar(254) NOT NULL UNIQUE, `senha` varchar(128) NOT NULL, `data_cadastro` datetime(6) NOT NULL, `is_active` bool NOT NULL, `is_staff` bool NOT NULL);
CREATE TABLE `usuario_groups` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `usuario_id` bigint NOT NULL, `group_id` integer NOT NULL);
CREATE TABLE `usuario_user_permissions` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `usuario_id` bigint NOT NULL, `permission_id` integer NOT NULL);
ALTER TABLE `usuario_groups` ADD CONSTRAINT `usuario_groups_usuario_id_group_id_2e3cd638_uniq` UNIQUE (`usuario_id`, `group_id`);
ALTER TABLE `usuario_groups` ADD CONSTRAINT `usuario_groups_usuario_id_161fc80c_fk_usuario_id_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id_usuario`);
ALTER TABLE `usuario_groups` ADD CONSTRAINT `usuario_groups_group_id_c67c8651_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);
ALTER TABLE `usuario_user_permissions` ADD CONSTRAINT `usuario_user_permissions_usuario_id_permission_id_3db58b8c_uniq` UNIQUE (`usuario_id`, `permission_id`);
ALTER TABLE `usuario_user_permissions` ADD CONSTRAINT `usuario_user_permiss_usuario_id_693d9c50_fk_usuario_i` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id_usuario`);
ALTER TABLE `usuario_user_permissions` ADD CONSTRAINT `usuario_user_permiss_permission_id_a8893ce7_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`);

--;
-- Create model LogEntry;
--;
CREATE TABLE `django_admin_log` (`id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `action_time` datetime(6) NOT NULL, `object_id` longtext NULL, `object_repr` varchar(200) NOT NULL, `action_flag` smallint UNSIGNED NOT NULL CHECK (`action_flag` >= 0), `change_message` longtext NOT NULL, `content_type_id` integer NULL, `user_id` bigint NOT NULL);
ALTER TABLE `django_admin_log` ADD CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);
ALTER TABLE `django_admin_log` ADD CONSTRAINT `django_admin_log_user_id_c564eba6_fk_usuario_id_usuario` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`id_usuario`);


--;
-- Alter field action_time on logentry;
--;

--;
-- Alter field action_flag on logentry;
--;
-- (no-op);

-- ---------------------------------------------------------------------
-- MontaAqui: peças de hardware
-- migration componentes.0001_initial
-- ---------------------------------------------------------------------

--;
-- Create model Armazenamento;
--;
CREATE TABLE `armazenamento` (`marca` varchar(50) NOT NULL, `modelo` varchar(100) NOT NULL, `preco` numeric(10, 2) NOT NULL, `id_armazenamento` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `tipo` varchar(20) NOT NULL, `unidade_medida` varchar(5) NOT NULL, `capacidade` integer NOT NULL, `interface` varchar(20) NOT NULL);
--;
-- Create model Cpu;
--;
CREATE TABLE `cpu` (`marca` varchar(50) NOT NULL, `modelo` varchar(100) NOT NULL, `preco` numeric(10, 2) NOT NULL, `id_cpu` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `socket` varchar(20) NOT NULL, `geracao` varchar(30) NOT NULL, `consumo_watts` integer NOT NULL, `nucleos` integer NOT NULL, `pontuacao_desempenho` integer NOT NULL);
--;
-- Create model Fonte;
--;
CREATE TABLE `fonte` (`marca` varchar(50) NOT NULL, `modelo` varchar(100) NOT NULL, `preco` numeric(10, 2) NOT NULL, `id_fonte` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `capacidade_watts` integer NOT NULL, `formato` varchar(10) NOT NULL, `conectores_pcie` varchar(50) NOT NULL);
--;
-- Create model Gabinete;
--;
CREATE TABLE `gabinete` (`marca` varchar(50) NOT NULL, `modelo` varchar(100) NOT NULL, `preco` numeric(10, 2) NOT NULL, `id_gabinete` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `formato` varchar(20) NOT NULL, `comprimento_max_gpu` integer NOT NULL, `formato_fonte` varchar(10) NOT NULL);
--;
-- Create model Gpu;
--;
CREATE TABLE `gpu` (`marca` varchar(50) NOT NULL, `modelo` varchar(100) NOT NULL, `preco` numeric(10, 2) NOT NULL, `id_gpu` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `vram` integer NOT NULL, `comprimento_mm` integer NOT NULL, `consumo_watts` integer NOT NULL, `conectores_necessarios` varchar(50) NOT NULL);
--;
-- Create model PlacaMae;
--;
CREATE TABLE `placamae` (`marca` varchar(50) NOT NULL, `modelo` varchar(100) NOT NULL, `preco` numeric(10, 2) NOT NULL, `id_placamae` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `socket` varchar(20) NOT NULL, `geracao_ddr` varchar(10) NOT NULL, `formato` varchar(20) NOT NULL, `geracao_cpu` varchar(100) NOT NULL, `velocidade_maxima_ram` integer NOT NULL, `interface_armazenamento` varchar(50) NOT NULL);
--;
-- Create model Ram;
--;
CREATE TABLE `ram` (`marca` varchar(50) NOT NULL, `modelo` varchar(100) NOT NULL, `preco` numeric(10, 2) NOT NULL, `id_ram` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `capacidade_gb` integer NOT NULL, `geracao_ddr` varchar(10) NOT NULL, `frequencia_mhz` integer NOT NULL);

-- ---------------------------------------------------------------------
-- MontaAqui: lojas parceiras e links de compra
-- migration lojas.0001_initial
-- ---------------------------------------------------------------------
--;
-- Create model Loja;
--;
CREATE TABLE `loja` (`id_loja` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `nome` varchar(100) NOT NULL, `url_base` varchar(255) NOT NULL, `codigoAfiliado` varchar(100) NOT NULL);
--;
-- Create model LojaArmazenamento;
--;
CREATE TABLE `loja_has_armazenamento` (`caminho_produto` varchar(255) NOT NULL, `armazenamento_id_armazenamento` integer NOT NULL, `loja_id_loja` integer NOT NULL, PRIMARY KEY (`loja_id_loja`, `armazenamento_id_armazenamento`));
--;
-- Create model LojaCpu;
--;
CREATE TABLE `loja_has_cpu` (`caminho_produto` varchar(255) NOT NULL, `cpu_id_cpu` integer NOT NULL, `loja_id_loja` integer NOT NULL, PRIMARY KEY (`loja_id_loja`, `cpu_id_cpu`));
--;
-- Create model LojaFonte;
--;
CREATE TABLE `loja_has_fonte` (`caminho_produto` varchar(255) NOT NULL, `fonte_id_fonte` integer NOT NULL, `loja_id_loja` integer NOT NULL, PRIMARY KEY (`loja_id_loja`, `fonte_id_fonte`));
--;
-- Create model LojaGabinete;
--;
CREATE TABLE `loja_has_gabinete` (`caminho_produto` varchar(255) NOT NULL, `gabinete_id_gabinete` integer NOT NULL, `loja_id_loja` integer NOT NULL, PRIMARY KEY (`loja_id_loja`, `gabinete_id_gabinete`));
--;
-- Create model LojaGpu;
--;
CREATE TABLE `loja_has_gpu` (`caminho_produto` varchar(255) NOT NULL, `gpu_id_gpu` integer NOT NULL, `loja_id_loja` integer NOT NULL, PRIMARY KEY (`loja_id_loja`, `gpu_id_gpu`));
--;
-- Create model LojaPlacaMae;
--;
CREATE TABLE `loja_has_placamae` (`caminho_produto` varchar(255) NOT NULL, `loja_id_loja` integer NOT NULL, `placamae_id_placamae` integer NOT NULL, PRIMARY KEY (`loja_id_loja`, `placamae_id_placamae`));
--;
-- Create model LojaRam;
--;
CREATE TABLE `loja_has_ram` (`caminho_produto` varchar(255) NOT NULL, `loja_id_loja` integer NOT NULL, `ram_id_ram` integer NOT NULL, PRIMARY KEY (`loja_id_loja`, `ram_id_ram`));
ALTER TABLE `loja_has_armazenamento` ADD CONSTRAINT `loja_has_armazenamen_armazenamento_id_arm_a7fea020_fk_armazenam` FOREIGN KEY (`armazenamento_id_armazenamento`) REFERENCES `armazenamento` (`id_armazenamento`);
ALTER TABLE `loja_has_armazenamento` ADD CONSTRAINT `loja_has_armazenamento_loja_id_loja_9fb11939_fk_loja_id_loja` FOREIGN KEY (`loja_id_loja`) REFERENCES `loja` (`id_loja`);
ALTER TABLE `loja_has_cpu` ADD CONSTRAINT `loja_has_cpu_cpu_id_cpu_3c54714a_fk_cpu_id_cpu` FOREIGN KEY (`cpu_id_cpu`) REFERENCES `cpu` (`id_cpu`);
ALTER TABLE `loja_has_cpu` ADD CONSTRAINT `loja_has_cpu_loja_id_loja_210d5c85_fk_loja_id_loja` FOREIGN KEY (`loja_id_loja`) REFERENCES `loja` (`id_loja`);
ALTER TABLE `loja_has_fonte` ADD CONSTRAINT `loja_has_fonte_fonte_id_fonte_dfd38a49_fk_fonte_id_fonte` FOREIGN KEY (`fonte_id_fonte`) REFERENCES `fonte` (`id_fonte`);
ALTER TABLE `loja_has_fonte` ADD CONSTRAINT `loja_has_fonte_loja_id_loja_00b46a11_fk_loja_id_loja` FOREIGN KEY (`loja_id_loja`) REFERENCES `loja` (`id_loja`);
ALTER TABLE `loja_has_gabinete` ADD CONSTRAINT `loja_has_gabinete_gabinete_id_gabinete_beaf6f34_fk_gabinete_` FOREIGN KEY (`gabinete_id_gabinete`) REFERENCES `gabinete` (`id_gabinete`);
ALTER TABLE `loja_has_gabinete` ADD CONSTRAINT `loja_has_gabinete_loja_id_loja_1cef446b_fk_loja_id_loja` FOREIGN KEY (`loja_id_loja`) REFERENCES `loja` (`id_loja`);
ALTER TABLE `loja_has_gpu` ADD CONSTRAINT `loja_has_gpu_gpu_id_gpu_616ebaf0_fk_gpu_id_gpu` FOREIGN KEY (`gpu_id_gpu`) REFERENCES `gpu` (`id_gpu`);
ALTER TABLE `loja_has_gpu` ADD CONSTRAINT `loja_has_gpu_loja_id_loja_4980adcf_fk_loja_id_loja` FOREIGN KEY (`loja_id_loja`) REFERENCES `loja` (`id_loja`);
ALTER TABLE `loja_has_placamae` ADD CONSTRAINT `loja_has_placamae_loja_id_loja_75d0936f_fk_loja_id_loja` FOREIGN KEY (`loja_id_loja`) REFERENCES `loja` (`id_loja`);
ALTER TABLE `loja_has_placamae` ADD CONSTRAINT `loja_has_placamae_placamae_id_placamae_1bb5e003_fk_placamae_` FOREIGN KEY (`placamae_id_placamae`) REFERENCES `placamae` (`id_placamae`);
ALTER TABLE `loja_has_ram` ADD CONSTRAINT `loja_has_ram_loja_id_loja_908d39c6_fk_loja_id_loja` FOREIGN KEY (`loja_id_loja`) REFERENCES `loja` (`id_loja`);
ALTER TABLE `loja_has_ram` ADD CONSTRAINT `loja_has_ram_ram_id_ram_44260f1c_fk_ram_id_ram` FOREIGN KEY (`ram_id_ram`) REFERENCES `ram` (`id_ram`);

-- ---------------------------------------------------------------------
-- MontaAqui: jogos, programas, questionário e setup
-- migration montagens.0001_initial
-- ---------------------------------------------------------------------
--;
-- Create model Jogo;
--;
CREATE TABLE `jogo` (`nome` varchar(100) NOT NULL, `desempenho_minimo` integer NOT NULL, `desempenho_recomendado` integer NOT NULL, `vram_minima` integer NOT NULL, `vram_recomendada` integer NOT NULL, `ram_minima` integer NOT NULL, `ram_recomendada` integer NOT NULL, `id_jogo` integer AUTO_INCREMENT NOT NULL PRIMARY KEY);
--;
-- Create model Programa;
--;
CREATE TABLE `programa` (`nome` varchar(100) NOT NULL, `desempenho_minimo` integer NOT NULL, `desempenho_recomendado` integer NOT NULL, `vram_minima` integer NOT NULL, `vram_recomendada` integer NOT NULL, `ram_minima` integer NOT NULL, `ram_recomendada` integer NOT NULL, `id_programa` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `categoria` varchar(50) NOT NULL);
--;
-- Create model Questionario;
--;
CREATE TABLE `questionario` (`id_questionario` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `finalidade` varchar(50) NOT NULL, `orcamento` numeric(10, 2) NOT NULL, `preferencia_cpu` varchar(20) NULL, `prioridade_desempenho` varchar(30) NULL, `fps_alvo` integer NULL, `resolucao_alvo` varchar(20) NULL, `data_preenchimento` datetime(6) NOT NULL);
--;
-- Create model QuestionarioJogo;
--;
CREATE TABLE `questionario_has_jogo` (`jogo_id_jogo` integer NOT NULL, `questionario_id_questionario` integer NOT NULL, PRIMARY KEY (`questionario_id_questionario`, `jogo_id_jogo`));
--;
-- Create model QuestionarioPrograma;
--;
CREATE TABLE `questionario_has_programa` (`programa_id_programa` integer NOT NULL, `questionario_id_questionario` integer NOT NULL, PRIMARY KEY (`questionario_id_questionario`, `programa_id_programa`));
--;
-- Create model Setup;
--;
CREATE TABLE `setup` (`id_setup` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `preco` numeric(10, 2) NOT NULL, `data_criacao` datetime(6) NOT NULL, `categoria` varchar(30) NOT NULL, `armazenamento_id_armazenamento` integer NOT NULL, `cpu_id_cpu` integer NOT NULL, `fonte_id_fonte` integer NOT NULL, `gabinete_id_gabinete` integer NOT NULL, `gpu_id_gpu` integer NOT NULL, `placamae_id_placamae` integer NOT NULL, `questionario_id_questionario` integer NOT NULL, `ram_id_ram` integer NOT NULL, `usuario_id_usuario` bigint NOT NULL);
ALTER TABLE `questionario_has_jogo` ADD CONSTRAINT `questionario_has_jogo_jogo_id_jogo_d24ce684_fk_jogo_id_jogo` FOREIGN KEY (`jogo_id_jogo`) REFERENCES `jogo` (`id_jogo`);
ALTER TABLE `questionario_has_jogo` ADD CONSTRAINT `questionario_has_jog_questionario_id_ques_147a5322_fk_questiona` FOREIGN KEY (`questionario_id_questionario`) REFERENCES `questionario` (`id_questionario`);
ALTER TABLE `questionario_has_programa` ADD CONSTRAINT `questionario_has_pro_programa_id_programa_d2f2a182_fk_programa_` FOREIGN KEY (`programa_id_programa`) REFERENCES `programa` (`id_programa`);
ALTER TABLE `questionario_has_programa` ADD CONSTRAINT `questionario_has_pro_questionario_id_ques_f942fd08_fk_questiona` FOREIGN KEY (`questionario_id_questionario`) REFERENCES `questionario` (`id_questionario`);
ALTER TABLE `setup` ADD CONSTRAINT `setup_armazenamento_id_arm_1e3ae663_fk_armazenam` FOREIGN KEY (`armazenamento_id_armazenamento`) REFERENCES `armazenamento` (`id_armazenamento`);
ALTER TABLE `setup` ADD CONSTRAINT `setup_cpu_id_cpu_28179073_fk_cpu_id_cpu` FOREIGN KEY (`cpu_id_cpu`) REFERENCES `cpu` (`id_cpu`);
ALTER TABLE `setup` ADD CONSTRAINT `setup_fonte_id_fonte_074d5fa8_fk_fonte_id_fonte` FOREIGN KEY (`fonte_id_fonte`) REFERENCES `fonte` (`id_fonte`);
ALTER TABLE `setup` ADD CONSTRAINT `setup_gabinete_id_gabinete_38340a55_fk_gabinete_id_gabinete` FOREIGN KEY (`gabinete_id_gabinete`) REFERENCES `gabinete` (`id_gabinete`);
ALTER TABLE `setup` ADD CONSTRAINT `setup_gpu_id_gpu_dbdb7d17_fk_gpu_id_gpu` FOREIGN KEY (`gpu_id_gpu`) REFERENCES `gpu` (`id_gpu`);
ALTER TABLE `setup` ADD CONSTRAINT `setup_placamae_id_placamae_1740ccea_fk_placamae_id_placamae` FOREIGN KEY (`placamae_id_placamae`) REFERENCES `placamae` (`id_placamae`);
ALTER TABLE `setup` ADD CONSTRAINT `setup_questionario_id_ques_a979e4fb_fk_questiona` FOREIGN KEY (`questionario_id_questionario`) REFERENCES `questionario` (`id_questionario`);
ALTER TABLE `setup` ADD CONSTRAINT `setup_ram_id_ram_b31c6148_fk_ram_id_ram` FOREIGN KEY (`ram_id_ram`) REFERENCES `ram` (`id_ram`);
ALTER TABLE `setup` ADD CONSTRAINT `setup_usuario_id_usuario_cca70292_fk_usuario_id_usuario` FOREIGN KEY (`usuario_id_usuario`) REFERENCES `usuario` (`id_usuario`);

-- ---------------------------------------------------------------------
-- Django: sessões de login
-- migration sessions.0001_initial
-- ---------------------------------------------------------------------
--;
-- Create model Session;
--;
CREATE TABLE `django_session` (`session_key` varchar(40) NOT NULL PRIMARY KEY, `session_data` longtext NOT NULL, `expire_date` datetime(6) NOT NULL);
CREATE INDEX `django_session_expire_date_a5c62663` ON `django_session` (`expire_date`);

-- ---------------------------------------------------------------------
-- Registro das migrations aplicadas
-- Pro Django saber que estas tabelas já existem e não tenta criá-las de novo ktchau.
-- ---------------------------------------------------------------------
CREATE TABLE `django_migrations` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `app` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `applied` datetime(6) NOT NULL);
INSERT INTO `django_migrations` (`app`, `name`, `applied`) VALUES
  ('contenttypes', '0001_initial', NOW(6)),
  ('contenttypes', '0002_remove_content_type_name', NOW(6)),
  ('auth', '0001_initial', NOW(6)),
  ('auth', '0002_alter_permission_name_max_length', NOW(6)),
  ('auth', '0003_alter_user_email_max_length', NOW(6)),
  ('auth', '0004_alter_user_username_opts', NOW(6)),
  ('auth', '0005_alter_user_last_login_null', NOW(6)),
  ('auth', '0006_require_contenttypes_0002', NOW(6)),
  ('auth', '0007_alter_validators_add_error_messages', NOW(6)),
  ('auth', '0008_alter_user_username_max_length', NOW(6)),
  ('auth', '0009_alter_user_last_name_max_length', NOW(6)),
  ('auth', '0010_alter_group_name_max_length', NOW(6)),
  ('auth', '0011_update_proxy_permissions', NOW(6)),
  ('auth', '0012_alter_user_first_name_max_length', NOW(6)),
  ('usuarios', '0001_initial', NOW(6)),
  ('admin', '0001_initial', NOW(6)),
  ('admin', '0002_logentry_remove_auto_add', NOW(6)),
  ('admin', '0003_logentry_add_action_flag_choices', NOW(6)),
  ('componentes', '0001_initial', NOW(6)),
  ('lojas', '0001_initial', NOW(6)),
  ('montagens', '0001_initial', NOW(6)),
  ('sessions', '0001_initial', NOW(6));
