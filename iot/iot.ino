#include <WiFi.h>
#include <WebServer.h>
#include <Adafruit_Fingerprint.h>

// Configuración de WiFi
const char* ssid = "TP-Link_0BD0";
const char* password = "49152739";

#define LOCK1_PIN 26
#define LOCK2_PIN 27
int relePins[] = {LOCK1_PIN, LOCK2_PIN};
int numReles = 2;

#define FINGERPRINT_RX 16
#define FINGERPRINT_TX 17

WebServer server(80);
HardwareSerial mySerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

unsigned long tiempoActivacion[2] = {0, 0};
const unsigned long duracion = 3000;
bool releActivo[2] = {false, false};

bool lockMode = false;

void setup() {
  Serial.begin(115200);
  
  for (int i = 0; i < numReles; i++) {
    pinMode(relePins[i], OUTPUT);
    digitalWrite(relePins[i], LOW);
  }

  // Conecta a WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado a WiFi");
  Serial.print("Dirección IP: ");
  Serial.println(WiFi.localIP());

  server.on("/rele", manejarRele);
  server.on("/estado", enviarEstado);
  server.begin();

  mySerial.begin(57600, SERIAL_8N1, FINGERPRINT_RX, FINGERPRINT_TX);
  finger.begin(57600);
  
  if (finger.verifyPassword()) {
    Serial.println("Sensor de huellas detectado!");
  } else {
    Serial.println("No se detectó el sensor de huellas :(");
    while (1) { delay(1); }
  }
  printMenu();
}

void loop() {
  server.handleClient();
  
  for (int i = 0; i < numReles; i++) {
    if (releActivo[i] && (millis() - tiempoActivacion[i] >= duracion)) {
      digitalWrite(relePins[i], LOW);
      releActivo[i] = false;
      Serial.print("Relé/Cerradura "); Serial.print(i + 1); Serial.println(" cerrada");
    }
  }

  if (lockMode) {
    if (Serial.available() > 0) {
      char option = Serial.read();
      if (option == 'm') {
        lockMode = false;
        Serial.println("Modo CRUD activado");
        printMenu();
        return;
      }
    }
    getFingerprintID();
    delay(100);
  } else {
    if (Serial.available() > 0) {
      String input = Serial.readStringUntil('\n');
      input.trim();
      if (input.length() > 0) {
        char option = input[0];
        switch (option) {
          case '1': enrollFingerprint(); break;
          case '2': deleteFingerprint(); break;
          case '3': lockMode = true; Serial.println("Modo apertura activado"); return;
          case '4': Serial.println("Saliendo del programa..."); return;
          default: Serial.println("Opción inválida"); break;
        }
        printMenu();
      }
    }
  }
}

void manejarRele() {
  String releStr = server.arg("numero");
  String estadoStr = server.arg("estado");
  int rele = releStr.toInt() - 1;

  if (rele >= 0 && rele < numReles) {
    if (estadoStr == "on") {
      digitalWrite(relePins[rele], HIGH);
      tiempoActivacion[rele] = millis();
      releActivo[rele] = true;
      server.send(200, "application/json", "{\"mensaje\":\"Relé encendido por 3 segundos\"}");
    } else if (estadoStr == "off") {
      digitalWrite(relePins[rele], LOW);
      releActivo[rele] = false;
      server.send(200, "application/json", "{\"mensaje\":\"Relé apagado\"}");
    } else {
      server.send(400, "application/json", "{\"error\":\"Estado inválido\"}");
    }
  } else {
    server.send(400, "application/json", "{\"error\":\"Relé inválido (solo 1 o 2)\"}");
  }
}

void enviarEstado() {
  String json = "{";
  for (int i = 0; i < numReles; i++) {
    json += "\"rele" + String(i + 1) + "\":" + (digitalRead(relePins[i]) == HIGH ? "\"on\"" : "\"off\"");
    if (i < numReles - 1) json += ",";
  }
  json += "}";
  server.send(200, "application/json", json);
}

void printMenu() {
  Serial.println("\n=== Menú de Opciones ===");
  Serial.println("1. Registrar nueva huella");
  Serial.println("2. Borrar huella existente");
  Serial.println("3. Cambiar a modo apertura");
  Serial.println("4. Salir del programa");
  Serial.println("Selecciona una opción (1-4):");
}

void enrollFingerprint() {
  Serial.println("\n=== Registrar Nueva Huella ===");
  Serial.println("Ingresa el ID (1 o 2):");
  int id = readNumberFromSerial();
  if (id != 1 && id != 2) {
    Serial.println("ID inválido. Solo se permiten los IDs 1 o 2.");
    return;
  }
  
  Serial.println("Coloca el dedo en el sensor...");
  uint8_t p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_OK) Serial.println("\nPrimera imagen tomada");
    else if (p == FINGERPRINT_NOFINGER) Serial.print(".");
    else { Serial.println("Error"); return; }
    delay(100);
  }

  p = finger.image2Tz(1);
  if (p != FINGERPRINT_OK) { Serial.println("Error al procesar"); return; }

  Serial.println("Retira el dedo...");
  while (p != FINGERPRINT_NOFINGER) {
    p = finger.getImage();
    delay(100);
  }

  Serial.println("Coloca el mismo dedo otra vez...");
  p = -1;
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_OK) Serial.println("\nSegunda imagen tomada");
    else if (p == FINGERPRINT_NOFINGER) Serial.print(".");
    else { Serial.println("Error"); return; }
    delay(100);
  }

  p = finger.image2Tz(2);
  if (p != FINGERPRINT_OK) { Serial.println("Error al procesar"); return; }

  p = finger.createModel();
  if (p != FINGERPRINT_OK) { Serial.println("Error al crear modelo"); return; }

  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.print("Huella registrada con ID #"); Serial.println(id);
  } else {
    Serial.println("Error al guardar huella");
  }
}

void deleteFingerprint() {
  Serial.println("\n=== Borrar Huella ===");
  Serial.println("Ingresa el ID a borrar (1 o 2):");
  int id = readNumberFromSerial();
  if (id != 1 && id != 2) {
    Serial.println("ID inválido");
    return;
  }

  if (finger.deleteModel(id) == FINGERPRINT_OK) {
    Serial.print("Huella ID #"); Serial.print(id); Serial.println(" borrada!");
  } else {
    Serial.println("Error al borrar huella");
  }
}

void getFingerprintID() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK) return;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) return;

  p = finger.fingerFastSearch();
  if (p == FINGERPRINT_OK) {
    Serial.print("Huella encontrada! ID #"); Serial.println(finger.fingerID);
    controlLocks(finger.fingerID);
  } else {
    Serial.println("Huella no reconocida");
  }
}

void controlLocks(int fingerID) {
  int rele = fingerID - 1;
  if (rele == 0 || rele == 1) {
    Serial.print("Abriendo Cerradura "); Serial.println(rele + 1);
    digitalWrite(relePins[rele], HIGH);
    tiempoActivacion[rele] = millis();
    releActivo[rele] = true;
  } else {
    Serial.println("ID no autorizada");
  }
}

int readNumberFromSerial() {
  while (Serial.available() == 0) { delay(10); }
  String input = Serial.readStringUntil('\n');
  input.trim();
  return input.toInt();
}