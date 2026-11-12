-- =====================================================================
-- MontaAqui: dados iniciais do catálogo (MySQL 8)
-- =====================================================================
-- Gerado em 05/09/2026 com os mesmos dados dos comandos do Django
-- "carregar_pecas" e "carregar_requisitos".
--
-- Rode depois de montaaqui_estrutura.sql, em um banco sem peças cadastradas.
-- Para atualizar dados que já existem, prefira os comandos do Django, que
-- atualizam em vez de duplicar:
--   python manage.py carregar_pecas
--   python manage.py carregar_requisitos
--
-- ATENÇÃO: preços são referências aproximadas e os links apontam para a busca
-- de cada loja. O código de afiliado é provisório.
-- =====================================================================

SET NAMES utf8mb4;
USE montaaqui;

START TRANSACTION;

-- cpu (9 linhas)
INSERT INTO `cpu` (`marca`, `modelo`, `preco`, `id_cpu`, `socket`, `geracao`, `consumo_watts`, `nucleos`, `pontuacao_desempenho`) VALUES
  ('Intel', 'Core i3-12100F', 499.90, 1, 'LGA1700', 'Intel 12', 58, 4, 30),
  ('AMD', 'Ryzen 5 5500', 549.90, 2, 'AM4', 'Ryzen 5000', 65, 6, 34),
  ('AMD', 'Ryzen 5 5600', 699.90, 3, 'AM4', 'Ryzen 5000', 65, 6, 40),
  ('Intel', 'Core i5-13400F', 1099.90, 4, 'LGA1700', 'Intel 13', 65, 10, 55),
  ('AMD', 'Ryzen 5 7600', 1199.90, 5, 'AM5', 'Ryzen 7000', 65, 6, 60),
  ('AMD', 'Ryzen 7 5700X3D', 1399.90, 6, 'AM4', 'Ryzen 5000', 105, 8, 64),
  ('Intel', 'Core i7-14700K', 2399.90, 7, 'LGA1700', 'Intel 14', 253, 20, 85),
  ('AMD', 'Ryzen 7 7800X3D', 2599.90, 8, 'AM5', 'Ryzen 7000', 120, 8, 88),
  ('AMD', 'Ryzen 7 9800X3D', 3299.90, 9, 'AM5', 'Ryzen 9000', 120, 8, 100);

-- placamae (9 linhas)
INSERT INTO `placamae` (`marca`, `modelo`, `preco`, `id_placamae`, `socket`, `geracao_ddr`, `formato`, `geracao_cpu`, `velocidade_maxima_ram`, `interface_armazenamento`) VALUES
  ('Gigabyte', 'H610M S2H DDR4', 549.90, 1, 'LGA1700', 'DDR4', 'Micro-ATX', 'Intel 12,Intel 13,Intel 14', 3200, 'SATA,M.2 NVMe'),
  ('ASUS', 'Prime A520M-K', 449.90, 2, 'AM4', 'DDR4', 'Micro-ATX', 'Ryzen 3000,Ryzen 5000', 4600, 'SATA,M.2 NVMe'),
  ('ASRock', 'B550M-HDV', 649.90, 3, 'AM4', 'DDR4', 'Micro-ATX', 'Ryzen 3000,Ryzen 5000', 4733, 'SATA,M.2 NVMe'),
  ('MSI', 'PRO B760M-P DDR4', 799.90, 4, 'LGA1700', 'DDR4', 'Micro-ATX', 'Intel 12,Intel 13,Intel 14', 4800, 'SATA,M.2 NVMe'),
  ('Gigabyte', 'B650M D3HP', 999.90, 5, 'AM5', 'DDR5', 'Micro-ATX', 'Ryzen 7000,Ryzen 8000,Ryzen 9000', 6400, 'SATA,M.2 NVMe'),
  ('MSI', 'MAG B550 Tomahawk', 1099.90, 6, 'AM4', 'DDR4', 'ATX', 'Ryzen 3000,Ryzen 5000', 5100, 'SATA,M.2 NVMe'),
  ('ASUS', 'TUF Gaming Z790-Plus WiFi', 2199.90, 7, 'LGA1700', 'DDR5', 'ATX', 'Intel 12,Intel 13,Intel 14', 7200, 'SATA,M.2 NVMe'),
  ('ASUS', 'TUF Gaming B650-Plus WiFi', 1599.90, 8, 'AM5', 'DDR5', 'ATX', 'Ryzen 7000,Ryzen 8000,Ryzen 9000', 6400, 'SATA,M.2 NVMe'),
  ('MSI', 'MAG X870 Tomahawk WiFi', 2499.90, 9, 'AM5', 'DDR5', 'ATX', 'Ryzen 7000,Ryzen 8000,Ryzen 9000', 8400, 'SATA,M.2 NVMe');

-- ram (9 linhas)
INSERT INTO `ram` (`marca`, `modelo`, `preco`, `id_ram`, `capacidade_gb`, `geracao_ddr`, `frequencia_mhz`) VALUES
  ('Kingston', 'Fury Beast 8GB DDR4 3200MHz', 129.90, 1, 8, 'DDR4', 3200),
  ('Kingston', 'Fury Beast 16GB (2x8GB) DDR4 3200MHz', 279.90, 2, 16, 'DDR4', 3200),
  ('XPG', 'Spectrix D35G 16GB (2x8GB) DDR4 3200MHz', 299.90, 3, 16, 'DDR4', 3200),
  ('Corsair', 'Vengeance LPX 16GB (2x8GB) DDR4 3600MHz', 329.90, 4, 16, 'DDR4', 3600),
  ('Kingston', 'Fury Beast 32GB (2x16GB) DDR4 3200MHz', 549.90, 5, 32, 'DDR4', 3200),
  ('Kingston', 'Fury Beast 16GB (2x8GB) DDR5 5600MHz', 499.90, 6, 16, 'DDR5', 5600),
  ('Kingston', 'Fury Beast 32GB (2x16GB) DDR5 6000MHz', 1099.90, 7, 32, 'DDR5', 6000),
  ('Corsair', 'Vengeance RGB 32GB (2x16GB) DDR5 6000MHz', 1299.90, 8, 32, 'DDR5', 6000),
  ('G.Skill', 'Trident Z5 Neo RGB 64GB (2x32GB) DDR5 6000MHz', 2499.90, 9, 64, 'DDR5', 6000);

-- gpu (9 linhas)
INSERT INTO `gpu` (`marca`, `modelo`, `preco`, `id_gpu`, `vram`, `comprimento_mm`, `consumo_watts`, `conectores_necessarios`) VALUES
  ('MSI', 'GeForce RTX 3050 Ventus 2X 6G OC', 1199.90, 1, 6, 189, 70, 'Nenhum'),
  ('PowerColor', 'Radeon RX 6600 Fighter 8GB', 1399.90, 2, 8, 200, 132, '1x 8 pinos'),
  ('ASRock', 'Intel Arc B580 Challenger 12GB OC', 1899.90, 3, 12, 270, 190, '1x 8 pinos'),
  ('MSI', 'GeForce RTX 5060 Ventus 2X OC 8GB', 2299.90, 4, 8, 197, 145, '1x 8 pinos'),
  ('Sapphire', 'Radeon RX 9060 XT Pulse 16GB', 2699.90, 5, 16, 240, 160, '1x 8 pinos'),
  ('Gigabyte', 'GeForce RTX 5060 Ti Windforce 16GB', 3299.90, 6, 16, 241, 180, '1x 8 pinos'),
  ('ASUS', 'GeForce RTX 5070 Prime OC 12GB', 4499.90, 7, 12, 304, 250, '1x 12V-2x6'),
  ('Sapphire', 'Radeon RX 9070 XT Pulse 16GB', 4999.90, 8, 16, 320, 304, '2x 8 pinos'),
  ('Gigabyte', 'GeForce RTX 5080 Windforce OC 16GB', 8499.90, 9, 16, 340, 360, '1x 12V-2x6');

-- fonte (9 linhas)
INSERT INTO `fonte` (`marca`, `modelo`, `preco`, `id_fonte`, `capacidade_watts`, `formato`, `conectores_pcie`) VALUES
  ('MSI', 'MAG A550BN 550W 80 Plus Bronze', 349.90, 1, 550, 'ATX', '2x 6+2 pinos'),
  ('Corsair', 'CV550 550W 80 Plus Bronze', 379.90, 2, 550, 'ATX', '2x 6+2 pinos'),
  ('Gigabyte', 'P650G 650W 80 Plus Gold', 449.90, 3, 650, 'ATX', '2x 6+2 pinos'),
  ('MSI', 'MAG A650GL 650W 80 Plus Gold', 549.90, 4, 650, 'ATX', '2x 6+2 pinos'),
  ('Cooler Master', 'MWE Gold 750 V2 750W', 649.90, 5, 750, 'ATX', '4x 6+2 pinos'),
  ('Corsair', 'RM750e 750W 80 Plus Gold', 749.90, 6, 750, 'ATX', '3x 6+2 pinos, 1x 12V-2x6'),
  ('Corsair', 'SF750 750W 80 Plus Platinum', 1199.90, 7, 750, 'SFX', '4x 6+2 pinos'),
  ('Corsair', 'RM850x 850W 80 Plus Gold', 999.90, 8, 850, 'ATX', '4x 6+2 pinos, 1x 12V-2x6'),
  ('MSI', 'MPG A1000GS 1000W 80 Plus Gold', 1299.90, 9, 1000, 'ATX', '4x 6+2 pinos, 1x 12V-2x6');

-- armazenamento (9 linhas)
INSERT INTO `armazenamento` (`marca`, `modelo`, `preco`, `id_armazenamento`, `tipo`, `unidade_medida`, `capacidade`, `interface`) VALUES
  ('Kingston', 'A400 480GB', 199.90, 1, 'SSD SATA', 'GB', 480, 'SATA'),
  ('Kingston', 'NV3 500GB', 219.90, 2, 'SSD NVMe', 'GB', 500, 'M.2 NVMe'),
  ('Seagate', 'Barracuda 1TB 7200RPM', 279.90, 3, 'HD', 'TB', 1, 'SATA'),
  ('Kingston', 'NV3 1TB', 379.90, 4, 'SSD NVMe', 'TB', 1, 'M.2 NVMe'),
  ('Crucial', 'P3 Plus 1TB', 419.90, 5, 'SSD NVMe', 'TB', 1, 'M.2 NVMe'),
  ('WD', 'Blue SN580 1TB', 449.90, 6, 'SSD NVMe', 'TB', 1, 'M.2 NVMe'),
  ('WD', 'Black SN850X 2TB', 1199.90, 7, 'SSD NVMe', 'TB', 2, 'M.2 NVMe'),
  ('Kingston', 'Fury Renegade 2TB', 1249.90, 8, 'SSD NVMe', 'TB', 2, 'M.2 NVMe'),
  ('Samsung', '990 Pro 2TB', 1299.90, 9, 'SSD NVMe', 'TB', 2, 'M.2 NVMe');

-- gabinete (9 linhas)
INSERT INTO `gabinete` (`marca`, `modelo`, `preco`, `id_gabinete`, `formato`, `comprimento_max_gpu`, `formato_fonte`) VALUES
  ('Cooler Master', 'MasterBox Q300L', 349.90, 1, 'Micro-ATX', 360, 'ATX'),
  ('Montech', 'AIR 100 Lite', 349.90, 2, 'Micro-ATX', 330, 'ATX'),
  ('Lian Li', 'Lancool 205M Mesh', 449.90, 3, 'Micro-ATX', 350, 'ATX'),
  ('Montech', 'AIR 903 Max', 649.90, 4, 'ATX', 400, 'ATX'),
  ('NZXT', 'H5 Flow', 649.90, 5, 'ATX', 365, 'ATX'),
  ('Lian Li', 'Lancool 216', 699.90, 6, 'ATX', 392, 'ATX'),
  ('NZXT', 'H7 Flow', 999.90, 7, 'ATX', 400, 'ATX'),
  ('Fractal Design', 'North', 1199.90, 8, 'ATX', 355, 'ATX'),
  ('Lian Li', 'O11 Dynamic EVO', 1199.90, 9, 'ATX', 426, 'ATX');

-- loja (3 linhas)
INSERT INTO `loja` (`id_loja`, `nome`, `url_base`, `codigoAfiliado`) VALUES
  (1, 'KaBuM!', 'https://www.kabum.com.br', 'MONTAAQUI_KABUM'),
  (2, 'Pichau', 'https://www.pichau.com.br', 'MONTAAQUI_PICHAU'),
  (3, 'Terabyte', 'https://www.terabyteshop.com.br', 'MONTAAQUI_TERABYTE');

-- loja_has_cpu (27 linhas)
INSERT INTO `loja_has_cpu` (`loja_id_loja`, `cpu_id_cpu`, `caminho_produto`) VALUES
  (1, 1, '/busca/intel-core-i3-12100f'),
  (1, 2, '/busca/amd-ryzen-5-5500'),
  (1, 3, '/busca/amd-ryzen-5-5600'),
  (1, 4, '/busca/intel-core-i5-13400f'),
  (1, 5, '/busca/amd-ryzen-5-7600'),
  (1, 6, '/busca/amd-ryzen-7-5700x3d'),
  (1, 7, '/busca/intel-core-i7-14700k'),
  (1, 8, '/busca/amd-ryzen-7-7800x3d'),
  (1, 9, '/busca/amd-ryzen-7-9800x3d'),
  (2, 1, '/search?q=Intel+Core+i3-12100F'),
  (2, 2, '/search?q=AMD+Ryzen+5+5500'),
  (2, 3, '/search?q=AMD+Ryzen+5+5600'),
  (2, 4, '/search?q=Intel+Core+i5-13400F'),
  (2, 5, '/search?q=AMD+Ryzen+5+7600'),
  (2, 6, '/search?q=AMD+Ryzen+7+5700X3D'),
  (2, 7, '/search?q=Intel+Core+i7-14700K'),
  (2, 8, '/search?q=AMD+Ryzen+7+7800X3D'),
  (2, 9, '/search?q=AMD+Ryzen+7+9800X3D'),
  (3, 1, '/busca?str=Intel+Core+i3-12100F'),
  (3, 2, '/busca?str=AMD+Ryzen+5+5500'),
  (3, 3, '/busca?str=AMD+Ryzen+5+5600'),
  (3, 4, '/busca?str=Intel+Core+i5-13400F'),
  (3, 5, '/busca?str=AMD+Ryzen+5+7600'),
  (3, 6, '/busca?str=AMD+Ryzen+7+5700X3D'),
  (3, 7, '/busca?str=Intel+Core+i7-14700K'),
  (3, 8, '/busca?str=AMD+Ryzen+7+7800X3D'),
  (3, 9, '/busca?str=AMD+Ryzen+7+9800X3D');

-- loja_has_placamae (27 linhas)
INSERT INTO `loja_has_placamae` (`loja_id_loja`, `placamae_id_placamae`, `caminho_produto`) VALUES
  (1, 1, '/busca/gigabyte-h610m-s2h-ddr4'),
  (1, 2, '/busca/asus-prime-a520m-k'),
  (1, 3, '/busca/asrock-b550m-hdv'),
  (1, 4, '/busca/msi-pro-b760m-p-ddr4'),
  (1, 5, '/busca/gigabyte-b650m-d3hp'),
  (1, 6, '/busca/msi-mag-b550-tomahawk'),
  (1, 7, '/busca/asus-tuf-gaming-z790-plus-wifi'),
  (1, 8, '/busca/asus-tuf-gaming-b650-plus-wifi'),
  (1, 9, '/busca/msi-mag-x870-tomahawk-wifi'),
  (2, 1, '/search?q=Gigabyte+H610M+S2H+DDR4'),
  (2, 2, '/search?q=ASUS+Prime+A520M-K'),
  (2, 3, '/search?q=ASRock+B550M-HDV'),
  (2, 4, '/search?q=MSI+PRO+B760M-P+DDR4'),
  (2, 5, '/search?q=Gigabyte+B650M+D3HP'),
  (2, 6, '/search?q=MSI+MAG+B550+Tomahawk'),
  (2, 7, '/search?q=ASUS+TUF+Gaming+Z790-Plus+WiFi'),
  (2, 8, '/search?q=ASUS+TUF+Gaming+B650-Plus+WiFi'),
  (2, 9, '/search?q=MSI+MAG+X870+Tomahawk+WiFi'),
  (3, 1, '/busca?str=Gigabyte+H610M+S2H+DDR4'),
  (3, 2, '/busca?str=ASUS+Prime+A520M-K'),
  (3, 3, '/busca?str=ASRock+B550M-HDV'),
  (3, 4, '/busca?str=MSI+PRO+B760M-P+DDR4'),
  (3, 5, '/busca?str=Gigabyte+B650M+D3HP'),
  (3, 6, '/busca?str=MSI+MAG+B550+Tomahawk'),
  (3, 7, '/busca?str=ASUS+TUF+Gaming+Z790-Plus+WiFi'),
  (3, 8, '/busca?str=ASUS+TUF+Gaming+B650-Plus+WiFi'),
  (3, 9, '/busca?str=MSI+MAG+X870+Tomahawk+WiFi');

-- loja_has_ram (27 linhas)
INSERT INTO `loja_has_ram` (`loja_id_loja`, `ram_id_ram`, `caminho_produto`) VALUES
  (1, 1, '/busca/kingston-fury-beast-8gb-ddr4-3200mhz'),
  (1, 2, '/busca/kingston-fury-beast-16gb-2x8gb-ddr4-3200mhz'),
  (1, 3, '/busca/xpg-spectrix-d35g-16gb-2x8gb-ddr4-3200mhz'),
  (1, 4, '/busca/corsair-vengeance-lpx-16gb-2x8gb-ddr4-3600mhz'),
  (1, 5, '/busca/kingston-fury-beast-32gb-2x16gb-ddr4-3200mhz'),
  (1, 6, '/busca/kingston-fury-beast-16gb-2x8gb-ddr5-5600mhz'),
  (1, 7, '/busca/kingston-fury-beast-32gb-2x16gb-ddr5-6000mhz'),
  (1, 8, '/busca/corsair-vengeance-rgb-32gb-2x16gb-ddr5-6000mhz'),
  (1, 9, '/busca/g-skill-trident-z5-neo-rgb-64gb-2x32gb-ddr5-6000mhz'),
  (2, 1, '/search?q=Kingston+Fury+Beast+8GB+DDR4+3200MHz'),
  (2, 2, '/search?q=Kingston+Fury+Beast+16GB+%282x8GB%29+DDR4+3200MHz'),
  (2, 3, '/search?q=XPG+Spectrix+D35G+16GB+%282x8GB%29+DDR4+3200MHz'),
  (2, 4, '/search?q=Corsair+Vengeance+LPX+16GB+%282x8GB%29+DDR4+3600MHz'),
  (2, 5, '/search?q=Kingston+Fury+Beast+32GB+%282x16GB%29+DDR4+3200MHz'),
  (2, 6, '/search?q=Kingston+Fury+Beast+16GB+%282x8GB%29+DDR5+5600MHz'),
  (2, 7, '/search?q=Kingston+Fury+Beast+32GB+%282x16GB%29+DDR5+6000MHz'),
  (2, 8, '/search?q=Corsair+Vengeance+RGB+32GB+%282x16GB%29+DDR5+6000MHz'),
  (2, 9, '/search?q=G.Skill+Trident+Z5+Neo+RGB+64GB+%282x32GB%29+DDR5+6000MHz'),
  (3, 1, '/busca?str=Kingston+Fury+Beast+8GB+DDR4+3200MHz'),
  (3, 2, '/busca?str=Kingston+Fury+Beast+16GB+%282x8GB%29+DDR4+3200MHz'),
  (3, 3, '/busca?str=XPG+Spectrix+D35G+16GB+%282x8GB%29+DDR4+3200MHz'),
  (3, 4, '/busca?str=Corsair+Vengeance+LPX+16GB+%282x8GB%29+DDR4+3600MHz'),
  (3, 5, '/busca?str=Kingston+Fury+Beast+32GB+%282x16GB%29+DDR4+3200MHz'),
  (3, 6, '/busca?str=Kingston+Fury+Beast+16GB+%282x8GB%29+DDR5+5600MHz'),
  (3, 7, '/busca?str=Kingston+Fury+Beast+32GB+%282x16GB%29+DDR5+6000MHz'),
  (3, 8, '/busca?str=Corsair+Vengeance+RGB+32GB+%282x16GB%29+DDR5+6000MHz'),
  (3, 9, '/busca?str=G.Skill+Trident+Z5+Neo+RGB+64GB+%282x32GB%29+DDR5+6000MHz');

-- loja_has_gpu (27 linhas)
INSERT INTO `loja_has_gpu` (`loja_id_loja`, `gpu_id_gpu`, `caminho_produto`) VALUES
  (1, 1, '/busca/msi-geforce-rtx-3050-ventus-2x-6g-oc'),
  (1, 2, '/busca/powercolor-radeon-rx-6600-fighter-8gb'),
  (1, 3, '/busca/asrock-intel-arc-b580-challenger-12gb-oc'),
  (1, 4, '/busca/msi-geforce-rtx-5060-ventus-2x-oc-8gb'),
  (1, 5, '/busca/sapphire-radeon-rx-9060-xt-pulse-16gb'),
  (1, 6, '/busca/gigabyte-geforce-rtx-5060-ti-windforce-16gb'),
  (1, 7, '/busca/asus-geforce-rtx-5070-prime-oc-12gb'),
  (1, 8, '/busca/sapphire-radeon-rx-9070-xt-pulse-16gb'),
  (1, 9, '/busca/gigabyte-geforce-rtx-5080-windforce-oc-16gb'),
  (2, 1, '/search?q=MSI+GeForce+RTX+3050+Ventus+2X+6G+OC'),
  (2, 2, '/search?q=PowerColor+Radeon+RX+6600+Fighter+8GB'),
  (2, 3, '/search?q=ASRock+Intel+Arc+B580+Challenger+12GB+OC'),
  (2, 4, '/search?q=MSI+GeForce+RTX+5060+Ventus+2X+OC+8GB'),
  (2, 5, '/search?q=Sapphire+Radeon+RX+9060+XT+Pulse+16GB'),
  (2, 6, '/search?q=Gigabyte+GeForce+RTX+5060+Ti+Windforce+16GB'),
  (2, 7, '/search?q=ASUS+GeForce+RTX+5070+Prime+OC+12GB'),
  (2, 8, '/search?q=Sapphire+Radeon+RX+9070+XT+Pulse+16GB'),
  (2, 9, '/search?q=Gigabyte+GeForce+RTX+5080+Windforce+OC+16GB'),
  (3, 1, '/busca?str=MSI+GeForce+RTX+3050+Ventus+2X+6G+OC'),
  (3, 2, '/busca?str=PowerColor+Radeon+RX+6600+Fighter+8GB'),
  (3, 3, '/busca?str=ASRock+Intel+Arc+B580+Challenger+12GB+OC'),
  (3, 4, '/busca?str=MSI+GeForce+RTX+5060+Ventus+2X+OC+8GB'),
  (3, 5, '/busca?str=Sapphire+Radeon+RX+9060+XT+Pulse+16GB'),
  (3, 6, '/busca?str=Gigabyte+GeForce+RTX+5060+Ti+Windforce+16GB'),
  (3, 7, '/busca?str=ASUS+GeForce+RTX+5070+Prime+OC+12GB'),
  (3, 8, '/busca?str=Sapphire+Radeon+RX+9070+XT+Pulse+16GB'),
  (3, 9, '/busca?str=Gigabyte+GeForce+RTX+5080+Windforce+OC+16GB');

-- loja_has_fonte (27 linhas)
INSERT INTO `loja_has_fonte` (`loja_id_loja`, `fonte_id_fonte`, `caminho_produto`) VALUES
  (1, 1, '/busca/msi-mag-a550bn-550w-80-plus-bronze'),
  (1, 2, '/busca/corsair-cv550-550w-80-plus-bronze'),
  (1, 3, '/busca/gigabyte-p650g-650w-80-plus-gold'),
  (1, 4, '/busca/msi-mag-a650gl-650w-80-plus-gold'),
  (1, 5, '/busca/cooler-master-mwe-gold-750-v2-750w'),
  (1, 6, '/busca/corsair-rm750e-750w-80-plus-gold'),
  (1, 7, '/busca/corsair-sf750-750w-80-plus-platinum'),
  (1, 8, '/busca/corsair-rm850x-850w-80-plus-gold'),
  (1, 9, '/busca/msi-mpg-a1000gs-1000w-80-plus-gold'),
  (2, 1, '/search?q=MSI+MAG+A550BN+550W+80+Plus+Bronze'),
  (2, 2, '/search?q=Corsair+CV550+550W+80+Plus+Bronze'),
  (2, 3, '/search?q=Gigabyte+P650G+650W+80+Plus+Gold'),
  (2, 4, '/search?q=MSI+MAG+A650GL+650W+80+Plus+Gold'),
  (2, 5, '/search?q=Cooler+Master+MWE+Gold+750+V2+750W'),
  (2, 6, '/search?q=Corsair+RM750e+750W+80+Plus+Gold'),
  (2, 7, '/search?q=Corsair+SF750+750W+80+Plus+Platinum'),
  (2, 8, '/search?q=Corsair+RM850x+850W+80+Plus+Gold'),
  (2, 9, '/search?q=MSI+MPG+A1000GS+1000W+80+Plus+Gold'),
  (3, 1, '/busca?str=MSI+MAG+A550BN+550W+80+Plus+Bronze'),
  (3, 2, '/busca?str=Corsair+CV550+550W+80+Plus+Bronze'),
  (3, 3, '/busca?str=Gigabyte+P650G+650W+80+Plus+Gold'),
  (3, 4, '/busca?str=MSI+MAG+A650GL+650W+80+Plus+Gold'),
  (3, 5, '/busca?str=Cooler+Master+MWE+Gold+750+V2+750W'),
  (3, 6, '/busca?str=Corsair+RM750e+750W+80+Plus+Gold'),
  (3, 7, '/busca?str=Corsair+SF750+750W+80+Plus+Platinum'),
  (3, 8, '/busca?str=Corsair+RM850x+850W+80+Plus+Gold'),
  (3, 9, '/busca?str=MSI+MPG+A1000GS+1000W+80+Plus+Gold');

-- loja_has_armazenamento (27 linhas)
INSERT INTO `loja_has_armazenamento` (`loja_id_loja`, `armazenamento_id_armazenamento`, `caminho_produto`) VALUES
  (1, 1, '/busca/kingston-a400-480gb'),
  (1, 2, '/busca/kingston-nv3-500gb'),
  (1, 3, '/busca/seagate-barracuda-1tb-7200rpm'),
  (1, 4, '/busca/kingston-nv3-1tb'),
  (1, 5, '/busca/crucial-p3-plus-1tb'),
  (1, 6, '/busca/wd-blue-sn580-1tb'),
  (1, 7, '/busca/wd-black-sn850x-2tb'),
  (1, 8, '/busca/kingston-fury-renegade-2tb'),
  (1, 9, '/busca/samsung-990-pro-2tb'),
  (2, 1, '/search?q=Kingston+A400+480GB'),
  (2, 2, '/search?q=Kingston+NV3+500GB'),
  (2, 3, '/search?q=Seagate+Barracuda+1TB+7200RPM'),
  (2, 4, '/search?q=Kingston+NV3+1TB'),
  (2, 5, '/search?q=Crucial+P3+Plus+1TB'),
  (2, 6, '/search?q=WD+Blue+SN580+1TB'),
  (2, 7, '/search?q=WD+Black+SN850X+2TB'),
  (2, 8, '/search?q=Kingston+Fury+Renegade+2TB'),
  (2, 9, '/search?q=Samsung+990+Pro+2TB'),
  (3, 1, '/busca?str=Kingston+A400+480GB'),
  (3, 2, '/busca?str=Kingston+NV3+500GB'),
  (3, 3, '/busca?str=Seagate+Barracuda+1TB+7200RPM'),
  (3, 4, '/busca?str=Kingston+NV3+1TB'),
  (3, 5, '/busca?str=Crucial+P3+Plus+1TB'),
  (3, 6, '/busca?str=WD+Blue+SN580+1TB'),
  (3, 7, '/busca?str=WD+Black+SN850X+2TB'),
  (3, 8, '/busca?str=Kingston+Fury+Renegade+2TB'),
  (3, 9, '/busca?str=Samsung+990+Pro+2TB');

-- loja_has_gabinete (27 linhas)
INSERT INTO `loja_has_gabinete` (`loja_id_loja`, `gabinete_id_gabinete`, `caminho_produto`) VALUES
  (1, 1, '/busca/cooler-master-masterbox-q300l'),
  (1, 2, '/busca/montech-air-100-lite'),
  (1, 3, '/busca/lian-li-lancool-205m-mesh'),
  (1, 4, '/busca/montech-air-903-max'),
  (1, 5, '/busca/nzxt-h5-flow'),
  (1, 6, '/busca/lian-li-lancool-216'),
  (1, 7, '/busca/nzxt-h7-flow'),
  (1, 8, '/busca/fractal-design-north'),
  (1, 9, '/busca/lian-li-o11-dynamic-evo'),
  (2, 1, '/search?q=Cooler+Master+MasterBox+Q300L'),
  (2, 2, '/search?q=Montech+AIR+100+Lite'),
  (2, 3, '/search?q=Lian+Li+Lancool+205M+Mesh'),
  (2, 4, '/search?q=Montech+AIR+903+Max'),
  (2, 5, '/search?q=NZXT+H5+Flow'),
  (2, 6, '/search?q=Lian+Li+Lancool+216'),
  (2, 7, '/search?q=NZXT+H7+Flow'),
  (2, 8, '/search?q=Fractal+Design+North'),
  (2, 9, '/search?q=Lian+Li+O11+Dynamic+EVO'),
  (3, 1, '/busca?str=Cooler+Master+MasterBox+Q300L'),
  (3, 2, '/busca?str=Montech+AIR+100+Lite'),
  (3, 3, '/busca?str=Lian+Li+Lancool+205M+Mesh'),
  (3, 4, '/busca?str=Montech+AIR+903+Max'),
  (3, 5, '/busca?str=NZXT+H5+Flow'),
  (3, 6, '/busca?str=Lian+Li+Lancool+216'),
  (3, 7, '/busca?str=NZXT+H7+Flow'),
  (3, 8, '/busca?str=Fractal+Design+North'),
  (3, 9, '/busca?str=Lian+Li+O11+Dynamic+EVO');

-- jogo (16 linhas)
INSERT INTO `jogo` (`nome`, `desempenho_minimo`, `desempenho_recomendado`, `vram_minima`, `vram_recomendada`, `ram_minima`, `ram_recomendada`, `id_jogo`) VALUES
  ('Valorant', 4, 25, 1, 4, 4, 4, 1),
  ('League of Legends', 3, 7, 1, 1, 2, 4, 2),
  ('Counter-Strike 2', 6, 15, 1, 4, 8, 16, 3),
  ('Fortnite', 6, 12, 1, 2, 8, 8, 4),
  ('Minecraft', 6, 13, 1, 2, 4, 8, 5),
  ('GTA V', 13, 26, 4, 8, 8, 16, 6),
  ('EA FC 25', 17, 21, 4, 6, 8, 12, 7),
  ('Rocket League', 4, 10, 2, 3, 4, 8, 8),
  ('COD: Warzone', 15, 18, 3, 8, 8, 12, 9),
  ('Cyberpunk 2077', 17, 68, 6, 8, 12, 16, 10),
  ('Elden Ring', 20, 26, 3, 8, 12, 16, 11),
  ('Red Dead Redemption 2', 9, 14, 2, 6, 8, 12, 12),
  ('Baldur\'s Gate 3', 11, 26, 4, 8, 8, 16, 13),
  ('Forza Horizon 5', 11, 20, 4, 8, 8, 16, 14),
  ('The Witcher 3', 9, 12, 2, 8, 8, 16, 15),
  ('Starfield', 20, 28, 8, 8, 16, 16, 16);

-- programa (12 linhas)
INSERT INTO `programa` (`nome`, `desempenho_minimo`, `desempenho_recomendado`, `vram_minima`, `vram_recomendada`, `ram_minima`, `ram_recomendada`, `id_programa`, `categoria`) VALUES
  ('Photoshop', 15, 26, 2, 4, 8, 16, 1, 'Edição de imagem'),
  ('Illustrator', 15, 26, 1, 4, 8, 16, 2, 'Design gráfico'),
  ('Lightroom', 15, 26, 2, 8, 8, 16, 3, 'Edição de imagem'),
  ('Premiere Pro', 15, 31, 2, 8, 8, 16, 4, 'Edição de vídeo'),
  ('After Effects', 15, 26, 4, 8, 16, 32, 5, 'Motion e efeitos visuais'),
  ('DaVinci Resolve', 17, 40, 4, 8, 16, 32, 6, 'Edição de vídeo'),
  ('Sony Vegas', 15, 26, 2, 4, 8, 16, 7, 'Edição de vídeo'),
  ('Blender', 12, 45, 2, 8, 8, 32, 8, 'Modelagem 3D'),
  ('Cinema 4D', 15, 40, 4, 8, 8, 16, 9, 'Modelagem 3D'),
  ('AutoCAD', 12, 30, 2, 8, 8, 32, 10, 'CAD'),
  ('Maya', 15, 40, 4, 8, 8, 16, 11, 'Animação 3D'),
  ('OBS Studio', 9, 30, 2, 4, 4, 8, 12, 'Streaming e gravação');

COMMIT;
