#!/bin/bash

echo "🧪 Test 1: Connexion HAProxy"
docker run --rm --network projetarchievenement_app-network mariadb:10.11 \
  mysql -h billetterie-haproxy -P 3309 -u billetterie_user -pbilletterie_password \
  -D billetterie -e "SELECT 'HAProxy OK' as test;"

echo "🧪 Test 2: Création table + insertion"
docker run --rm --network projetarchievenement_app-network mariadb:10.11 \
  mysql -h billetterie-haproxy -P 3309 -u billetterie_user -pbilletterie_password \
  -D billetterie -e "CREATE TABLE IF NOT EXISTS test_ha (id INT AUTO_INCREMENT PRIMARY KEY, message VARCHAR(100)); SHOW TABLES;"

echo "🧪 Test 3: Arrêt nœud 1 + insertion pendant panne"
docker-compose stop mariadb-node1

docker run --rm --network projetarchievenement_app-network mariadb:10.11 \
  mysql -h billetterie-haproxy -P 3309 -u billetterie_user -pbilletterie_password \
  -D billetterie -e "INSERT INTO test_ha (message) VALUES ('Test bascule OK'); SELECT * FROM test_ha;"

echo "🧪 Test 4: Redémarrage + vérification"
docker-compose start mariadb-node1
sleep 10

docker run --rm --network projetarchievenement_app-network mariadb:10.11 \
  mysql -h billetterie-haproxy -P 3309 -u billetterie_user -pbilletterie_password \
  -D billetterie -e "SELECT * FROM test_ha;"

echo "✅ Tests terminés !"
