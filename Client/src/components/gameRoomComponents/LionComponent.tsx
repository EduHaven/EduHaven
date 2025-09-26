import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./LionComponent.css";

const LionComponent: React.FC = () => {
  const worldRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scene: THREE.Scene,
      camera: THREE.PerspectiveCamera,
      renderer: THREE.WebGLRenderer,
      container: HTMLElement | null,
      floor: THREE.Mesh,
      lion: any,
      fan: any,
      isBlowing = false;

    let HEIGHT: number,
      WIDTH: number,
      windowHalfX: number,
      windowHalfY: number,
      mousePos = { x: 0, y: 0 };

    const clock = new THREE.Clock();
    let time = 0;
    let deltaTime = 0;

    // Fan class definition remains the same
    class Fan {
      isBlowing: boolean;
      speed: number;
      acc: number;
      redMat: THREE.MeshLambertMaterial;
      greyMat: THREE.MeshLambertMaterial;
      yellowMat: THREE.MeshLambertMaterial;
      core: THREE.Mesh;
      propeller: THREE.Group;
      sphere: THREE.Mesh;
      threegroup: THREE.Group;
      tPosX: number;
      tPosY: number;
      targetSpeed: number;

      constructor() {
        this.isBlowing = false;
        this.speed = 0;
        this.acc = 0;
        this.redMat = new THREE.MeshLambertMaterial({
          color: 0xad3525,
          flatShading: true,
        });
        this.greyMat = new THREE.MeshLambertMaterial({
          color: 0x653f4c,
          flatShading: true,
        });
        this.yellowMat = new THREE.MeshLambertMaterial({
          color: 0xfdd276,
          flatShading: true,
        });

        const coreGeom = new THREE.BoxGeometry(10, 10, 20);
        const sphereGeom = new THREE.BoxGeometry(10, 10, 3);
        const propGeom = new THREE.BoxGeometry(10, 30, 2);
        propGeom.translate(0, 25, 0);

        this.core = new THREE.Mesh(coreGeom, this.greyMat);

        // propellers
        const prop1 = new THREE.Mesh(propGeom, this.redMat);
        prop1.position.z = 15;
        const prop2 = prop1.clone();
        prop2.rotation.z = Math.PI / 2;
        const prop3 = prop1.clone();
        prop3.rotation.z = Math.PI;
        const prop4 = prop1.clone();
        prop4.rotation.z = -Math.PI / 2;

        this.sphere = new THREE.Mesh(sphereGeom, this.yellowMat);
        this.sphere.position.z = 15;

        this.propeller = new THREE.Group();
        this.propeller.add(prop1);
        this.propeller.add(prop2);
        this.propeller.add(prop3);
        this.propeller.add(prop4);

        this.threegroup = new THREE.Group();
        this.threegroup.add(this.core);
        this.threegroup.add(this.propeller);
        this.threegroup.add(this.sphere);
      }

      update(xTarget: number, yTarget: number, deltaTime: number) {
        this.threegroup.lookAt(new THREE.Vector3(0, 80, 60));
        this.tPosX = rule3(xTarget, -200, 200, -250, 250);
        this.tPosY = rule3(yTarget, -200, 200, 250, -250);

        this.threegroup.position.x +=
          (this.tPosX - this.threegroup.position.x) * deltaTime * 4;
        this.threegroup.position.y +=
          (this.tPosY - this.threegroup.position.y) * deltaTime * 4;

        this.targetSpeed = this.isBlowing ? 15 * deltaTime : 5 * deltaTime;
        if (this.isBlowing && this.speed < this.targetSpeed) {
          this.acc += 0.01 * deltaTime;
          this.speed += this.acc;
        } else if (!this.isBlowing) {
          this.acc = 0;
          this.speed *= Math.pow(0.4, deltaTime);
        }
        this.propeller.rotation.z += this.speed;
      }
    }

    class Lion {
      windTime: number;
      bodyInitPositions: any[];
      maneParts: any[];
      threegroup: THREE.Group;
      yellowMat: THREE.MeshLambertMaterial;
      redMat: THREE.MeshLambertMaterial;
      pinkMat: THREE.MeshLambertMaterial;
      whiteMat: THREE.MeshLambertMaterial;
      purpleMat: THREE.MeshLambertMaterial;
      greyMat: THREE.MeshLambertMaterial;
      blackMat: THREE.MeshLambertMaterial;
      body: THREE.Mesh;
      head: THREE.Group;
      mustaches: THREE.Mesh[];
      bodyVertices: number[];
      tHeagRotY: number;
      tHeadRotX: number;
      tHeadPosX: number;
      tHeadPosY: number;
      tHeadPosZ: number;
      tEyeScale: number;
      tIrisYScale: number;
      tIrisZScale: number;
      tIrisPosY: number;
      tLeftIrisPosZ: number;
      tRightIrisPosZ: number;
      tLipsPosX: number;
      tLipsPosY: number;
      tMouthPosZ: number;
      tSmilePosX: number;
      tSmilePosZ: number;
      tSmilePosY: number;
      tSmileRotZ: number;
      tRightKneeRotZ: number;
      tLeftKneeRotZ: number;
      leftEye: THREE.Mesh;
      rightEye: THREE.Mesh;
      leftIris: THREE.Mesh;
      rightIris: THREE.Mesh;
      mane: THREE.Group;
      rightKnee: THREE.Mesh;
      leftKnee: THREE.Mesh;
      lips: THREE.Mesh;
      smile: THREE.Mesh;
      mouth: THREE.Mesh;
      leftEar: THREE.Mesh;
      rightEar: THREE.Mesh;

      constructor() {
        this.windTime = 0;
        this.bodyInitPositions = [];
        this.maneParts = [];
        this.threegroup = new THREE.Group();
        this.mustaches = [];

        // Materials with fixed colors
        this.yellowMat = new THREE.MeshLambertMaterial({
          color: 0xfdd276,
          flatShading: true,
        });
        this.redMat = new THREE.MeshLambertMaterial({
          color: 0xad3525,
          flatShading: true,
        });
        this.pinkMat = new THREE.MeshLambertMaterial({
          color: 0xe55d2b,
          flatShading: true,
        });
        this.whiteMat = new THREE.MeshLambertMaterial({
          color: 0xffffff,
          flatShading: true,
        });
        this.purpleMat = new THREE.MeshLambertMaterial({
          color: 0x451954,
          flatShading: true,
        });
        this.greyMat = new THREE.MeshLambertMaterial({
          color: 0x653f4c,
          flatShading: true,
        });
        this.blackMat = new THREE.MeshLambertMaterial({
          color: 0x302925,
          flatShading: true,
        });

        // Geometries
        const bodyGeom = new THREE.CylinderGeometry(30, 80, 140, 4);
        const maneGeom = new THREE.BoxGeometry(40, 40, 15);
        const faceGeom = new THREE.BoxGeometry(80, 80, 80);
        const spotGeom = new THREE.BoxGeometry(4, 4, 4);
        const mustacheGeom = new THREE.BoxGeometry(30, 2, 1);
        mustacheGeom.translate(15, 0, 0);

        const earGeom = new THREE.BoxGeometry(20, 20, 20);
        const noseGeom = new THREE.BoxGeometry(40, 40, 20);
        const eyeGeom = new THREE.BoxGeometry(5, 30, 30);
        const irisGeom = new THREE.BoxGeometry(4, 10, 10);
        const mouthGeom = new THREE.BoxGeometry(20, 20, 10);
        const smileGeom = new THREE.TorusGeometry(12, 4, 2, 10, Math.PI);
        const lipsGeom = new THREE.BoxGeometry(40, 15, 20);
        const kneeGeom = new THREE.BoxGeometry(25, 80, 80);
        kneeGeom.translate(0, 50, 0);
        const footGeom = new THREE.BoxGeometry(40, 20, 20);

        // Body
        this.body = new THREE.Mesh(bodyGeom, this.yellowMat);
        this.body.position.z = -60;
        this.body.position.y = -30;

        // In modern Three.js, we need to access position attributes differently
        const positionAttribute = this.body.geometry.getAttribute("position");
        this.bodyVertices = [0, 1, 2, 3, 4, 10];

        for (let i = 0; i < this.bodyVertices.length; i++) {
          const index = this.bodyVertices[i];
          if (index < positionAttribute.count) {
            const x = positionAttribute.getX(index);
            const y = positionAttribute.getY(index);
            positionAttribute.setZ(index, 70);
            this.bodyInitPositions.push({ x, y, z: 70 });
          }
        }
        positionAttribute.needsUpdate = true;

        // Head
        this.head = new THREE.Group();
        const face = new THREE.Mesh(faceGeom, this.yellowMat);
        face.position.z = 135;
        this.head.add(face);

        // Mustaches (Fixed positioning)
        this.mustache1 = new THREE.Mesh(mustacheGeom, this.blackMat);
        this.mustache1.position.x = 30;
        this.mustache1.position.y = -5;
        this.mustache1.position.z = 175;
        this.head.add(this.mustache1);

        this.mustache2 = this.mustache1.clone();
        this.mustache2.position.x = 35;
        this.mustache2.position.y = -12;
        this.head.add(this.mustache2);

        this.mustache3 = this.mustache1.clone();
        this.mustache3.position.y = -19;
        this.mustache3.position.x = 30;
        this.head.add(this.mustache3);

        // Right side mustaches
        this.mustache4 = this.mustache1.clone();
        this.mustache4.rotation.z = Math.PI;
        this.mustache4.position.x = -30;
        this.head.add(this.mustache4);

        this.mustache5 = this.mustache2.clone();
        this.mustache5.rotation.z = Math.PI;
        this.mustache5.position.x = -35;
        this.head.add(this.mustache5);

        this.mustache6 = this.mustache3.clone();
        this.mustache6.rotation.z = Math.PI;
        this.mustache6.position.x = -30;
        this.head.add(this.mustache6);

        this.mustaches = [
          this.mustache1,
          this.mustache2,
          this.mustache3,
          this.mustache4,
          this.mustache5,
          this.mustache6,
        ];

        // Spots (Fixed positioning)
        const spot1 = new THREE.Mesh(spotGeom, this.redMat);
        spot1.position.x = 39;
        spot1.position.z = 150;
        this.head.add(spot1);

        const spot2 = spot1.clone();
        spot2.position.z = 160;
        spot2.position.y = -10;
        this.head.add(spot2);

        const spot3 = spot1.clone();
        spot3.position.z = 140;
        spot3.position.y = -15;
        this.head.add(spot3);

        const spot4 = spot1.clone();
        spot4.position.z = 150;
        spot4.position.y = -20;
        this.head.add(spot4);

        const spot5 = spot1.clone();
        spot5.position.x = -39;
        this.head.add(spot5);

        const spot6 = spot2.clone();
        spot6.position.x = -39;
        this.head.add(spot6);

        const spot7 = spot3.clone();
        spot7.position.x = -39;
        this.head.add(spot7);

        const spot8 = spot4.clone();
        spot8.position.x = -39;
        this.head.add(spot8);

        // Eyes
        this.leftEye = new THREE.Mesh(eyeGeom, this.whiteMat);
        this.leftEye.position.x = 40;
        this.leftEye.position.z = 120;
        this.leftEye.position.y = 25;
        this.head.add(this.leftEye);

        this.rightEye = new THREE.Mesh(eyeGeom, this.whiteMat);
        this.rightEye.position.x = -40;
        this.rightEye.position.z = 120;
        this.rightEye.position.y = 25;
        this.head.add(this.rightEye);

        // Iris
        this.leftIris = new THREE.Mesh(irisGeom, this.purpleMat);
        this.leftIris.position.x = 42;
        this.leftIris.position.z = 120;
        this.leftIris.position.y = 25;
        this.head.add(this.leftIris);

        this.rightIris = new THREE.Mesh(irisGeom, this.purpleMat);
        this.rightIris.position.x = -42;
        this.rightIris.position.z = 120;
        this.rightIris.position.y = 25;
        this.head.add(this.rightIris);

        // Mouth and Smile
        this.mouth = new THREE.Mesh(mouthGeom, this.blackMat);
        this.mouth.position.z = 171;
        this.mouth.position.y = -30;
        this.mouth.scale.set(0.5, 0.5, 1);
        this.head.add(this.mouth);

        this.smile = new THREE.Mesh(smileGeom, this.greyMat);
        this.smile.position.z = 173;
        this.smile.position.y = -15;
        this.smile.rotation.z = -Math.PI;
        this.head.add(this.smile);

        this.lips = new THREE.Mesh(lipsGeom, this.yellowMat);
        this.lips.position.z = 165;
        this.lips.position.y = -45;
        this.head.add(this.lips);

        // Nose
        const nose = new THREE.Mesh(noseGeom, this.greyMat);
        nose.position.z = 170;
        nose.position.y = 25;
        this.head.add(nose);

        // Ears
        this.rightEar = new THREE.Mesh(earGeom, this.yellowMat);
        this.rightEar.position.x = -50;
        this.rightEar.position.y = 50;
        this.rightEar.position.z = 105;
        this.head.add(this.rightEar);

        this.leftEar = new THREE.Mesh(earGeom, this.yellowMat);
        this.leftEar.position.x = 50;
        this.leftEar.position.y = 50;
        this.leftEar.position.z = 105;
        this.head.add(this.leftEar);

        // Mane
        this.mane = new THREE.Group();
        for (let j = 0; j < 4; j++) {
          for (let k = 0; k < 4; k++) {
            const manePart = new THREE.Mesh(maneGeom, this.redMat);
            manePart.position.x = j * 40 - 60;
            manePart.position.y = k * 40 - 60;

            let amp;
            let zOffset;
            const periodOffset = Math.random() * Math.PI * 2;

            if (
              (j === 0 && k === 0) ||
              (j === 0 && k === 3) ||
              (j === 3 && k === 0) ||
              (j === 3 && k === 3)
            ) {
              amp = -10 - Math.floor(Math.random() * 5);
              zOffset = -5;
            } else if (j === 0 || k === 0 || j === 3 || k === 3) {
              amp = -5 - Math.floor(Math.random() * 5);
              zOffset = 0;
            } else {
              amp = 0;
              zOffset = 0;
            }

            this.maneParts.push({
              mesh: manePart,
              amp,
              zOffset,
              periodOffset,
              xInit: manePart.position.x,
              yInit: manePart.position.y,
            });
            this.mane.add(manePart);
          }
        }

        this.mane.position.y = -10;
        this.mane.position.z = 80;
        this.head.add(this.mane);

        // Position head
        this.head.position.y = 60;

        // Knees
        this.leftKnee = new THREE.Mesh(kneeGeom, this.yellowMat);
        this.leftKnee.position.x = 65;
        this.leftKnee.position.z = -20;
        this.leftKnee.position.y = -110;
        this.leftKnee.rotation.z = -0.3;

        this.rightKnee = new THREE.Mesh(kneeGeom, this.yellowMat);
        this.rightKnee.position.x = -65;
        this.rightKnee.position.z = -20;
        this.rightKnee.position.y = -110;
        this.rightKnee.rotation.z = 0.3;

        // Feet
        const backLeftFoot = new THREE.Mesh(footGeom, this.yellowMat);
        backLeftFoot.position.z = 30;
        backLeftFoot.position.x = 75;
        backLeftFoot.position.y = -90;

        const backRightFoot = new THREE.Mesh(footGeom, this.yellowMat);
        backRightFoot.position.z = 30;
        backRightFoot.position.x = -75;
        backRightFoot.position.y = -90;

        const frontRightFoot = new THREE.Mesh(footGeom, this.yellowMat);
        frontRightFoot.position.z = 40;
        frontRightFoot.position.x = -22;
        frontRightFoot.position.y = -90;

        const frontLeftFoot = new THREE.Mesh(footGeom, this.yellowMat);
        frontLeftFoot.position.z = 40;
        frontLeftFoot.position.x = 22;
        frontLeftFoot.position.y = -90;

        // Assemble lion
        this.threegroup.add(this.body);
        this.threegroup.add(this.head);
        this.threegroup.add(this.leftKnee);
        this.threegroup.add(this.rightKnee);
        this.threegroup.add(backLeftFoot);
        this.threegroup.add(backRightFoot);
        this.threegroup.add(frontRightFoot);
        this.threegroup.add(frontLeftFoot);

        // Add shadows
        this.threegroup.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });
      }

      updateBody(speed: number) {
        this.head.rotation.y += (this.tHeagRotY - this.head.rotation.y) / speed;
        this.head.rotation.x += (this.tHeadRotX - this.head.rotation.x) / speed;
        this.head.position.x += (this.tHeadPosX - this.head.position.x) / speed;
        this.head.position.y += (this.tHeadPosY - this.head.position.y) / speed;
        this.head.position.z += (this.tHeadPosZ - this.head.position.z) / speed;

        this.leftEye.scale.y +=
          (this.tEyeScale - this.leftEye.scale.y) / (speed * 2);
        this.rightEye.scale.y = this.leftEye.scale.y;

        this.leftIris.scale.y +=
          (this.tIrisYScale - this.leftIris.scale.y) / (speed * 2);
        this.rightIris.scale.y = this.leftIris.scale.y;

        this.leftIris.scale.z +=
          (this.tIrisZScale - this.leftIris.scale.z) / (speed * 2);
        this.rightIris.scale.z = this.leftIris.scale.z;

        this.leftIris.position.y +=
          (this.tIrisPosY - this.leftIris.position.y) / speed;
        this.rightIris.position.y = this.leftIris.position.y;
        this.leftIris.position.z +=
          (this.tLeftIrisPosZ - this.leftIris.position.z) / speed;
        this.rightIris.position.z +=
          (this.tRightIrisPosZ - this.rightIris.position.z) / speed;

        this.rightKnee.rotation.z +=
          (this.tRightKneeRotZ - this.rightKnee.rotation.z) / speed;
        this.leftKnee.rotation.z +=
          (this.tLeftKneeRotZ - this.leftKnee.rotation.z) / speed;

        this.lips.position.x += (this.tLipsPosX - this.lips.position.x) / speed;
        this.lips.position.y += (this.tLipsPosY - this.lips.position.y) / speed;
        this.smile.position.x +=
          (this.tSmilePosX - this.smile.position.x) / speed;
        this.mouth.position.z +=
          (this.tMouthPosZ - this.mouth.position.z) / speed;
        this.smile.position.z +=
          (this.tSmilePosZ - this.smile.position.z) / speed;
        this.smile.position.y +=
          (this.tSmilePosY - this.smile.position.y) / speed;
        this.smile.rotation.z +=
          (this.tSmileRotZ - this.smile.rotation.z) / speed;
      }

      look(xTarget: number, yTarget: number) {
        this.tHeagRotY = rule3(xTarget, -200, 200, -Math.PI / 4, Math.PI / 4);
        this.tHeadRotX = rule3(yTarget, -200, 200, -Math.PI / 4, Math.PI / 4);
        this.tHeadPosX = rule3(xTarget, -200, 200, 70, -70);
        this.tHeadPosY = rule3(yTarget, -140, 260, 20, 100);
        this.tHeadPosZ = 0;

        this.tEyeScale = 1;
        this.tIrisYScale = 1;
        this.tIrisZScale = 1;
        this.tIrisPosY = rule3(yTarget, -200, 200, 35, 15);
        this.tLeftIrisPosZ = rule3(xTarget, -200, 200, 130, 110);
        this.tRightIrisPosZ = rule3(xTarget, -200, 200, 110, 130);

        this.tLipsPosX = 0;
        this.tLipsPosY = -45;

        this.tSmilePosX = 0;
        this.tMouthPosZ = 174;
        this.tSmilePosZ = 173;
        this.tSmilePosY = -15;
        this.tSmileRotZ = -Math.PI;

        this.tRightKneeRotZ = rule3(
          xTarget,
          -200,
          200,
          0.3 - Math.PI / 8,
          0.3 + Math.PI / 8
        );
        this.tLeftKneeRotZ = rule3(
          xTarget,
          -200,
          200,
          -0.3 - Math.PI / 8,
          -0.3 + Math.PI / 8
        );

        this.updateBody(10);

        this.mane.rotation.y = 0;
        this.mane.rotation.x = 0;

        for (const part of this.maneParts) {
          part.mesh.position.z = 0;
          part.mesh.rotation.y = 0;
        }

        for (const mustache of this.mustaches) {
          mustache.rotation.y = 0;
        }

        // Update body vertices
        const positionAttribute = this.body.geometry.getAttribute("position");
        for (let i = 0; i < this.bodyVertices.length; i++) {
          const index = this.bodyVertices[i];
          if (index < positionAttribute.count) {
            const tvInit = this.bodyInitPositions[i];
            positionAttribute.setX(index, tvInit.x + this.head.position.x);
          }
        }
        positionAttribute.needsUpdate = true;
      }

      cool(xTarget: number, yTarget: number, deltaTime: number) {
        this.tHeagRotY = rule3(xTarget, -200, 200, Math.PI / 4, -Math.PI / 4);
        this.tHeadRotX = rule3(yTarget, -200, 200, Math.PI / 4, -Math.PI / 4);
        this.tHeadPosX = rule3(xTarget, -200, 200, -70, 70);
        this.tHeadPosY = rule3(yTarget, -140, 260, 100, 20);
        this.tHeadPosZ = 100;

        this.tEyeScale = 0.1;
        this.tIrisYScale = 0.1;
        this.tIrisZScale = 3;

        this.tIrisPosY = 20;
        this.tLeftIrisPosZ = 120;
        this.tRightIrisPosZ = 120;

        this.tLipsPosX = rule3(xTarget, -200, 200, -15, 15);
        this.tLipsPosY = rule3(yTarget, -200, 200, -45, -40);

        this.tMouthPosZ = 168;
        this.tSmilePosX = rule3(xTarget, -200, 200, -15, 15);
        this.tSmilePosY = rule3(yTarget, -200, 200, -20, -8);
        this.tSmilePosZ = 176;
        this.tSmileRotZ = rule3(
          xTarget,
          -200,
          200,
          -Math.PI - 0.3,
          -Math.PI + 0.3
        );

        this.tRightKneeRotZ = rule3(
          xTarget,
          -200,
          200,
          0.3 + Math.PI / 8,
          0.3 - Math.PI / 8
        );
        this.tLeftKneeRotZ = rule3(
          xTarget,
          -200,
          200,
          -0.3 + Math.PI / 8,
          -0.3 - Math.PI / 8
        );

        this.updateBody(10);

        this.mane.rotation.y = -0.8 * this.head.rotation.y;
        this.mane.rotation.x = -0.8 * this.head.rotation.x;

        const dt = Math.max(
          Math.min(20000 / (xTarget * xTarget + yTarget * yTarget), 1),
          0.5
        );
        this.windTime += dt * deltaTime * 40;

        for (const part of this.maneParts) {
          part.mesh.position.z =
            part.zOffset +
            Math.sin(this.windTime + part.periodOffset) * part.amp * dt * 2;
        }

        this.leftEar.rotation.x =
          ((Math.cos(this.windTime) * Math.PI) / 16) * dt;
        this.rightEar.rotation.x =
          ((-Math.cos(this.windTime) * Math.PI) / 16) * dt;

        for (let i = 0; i < this.mustaches.length; i++) {
          const m = this.mustaches[i];
          const amp = i < 3 ? -Math.PI / 8 : Math.PI / 8;
          m.rotation.y = amp + Math.cos(this.windTime + i) * dt * amp;
        }

        // Update body vertices
        const positionAttribute = this.body.geometry.getAttribute("position");
        for (let i = 0; i < this.bodyVertices.length; i++) {
          const index = this.bodyVertices[i];
          if (index < positionAttribute.count) {
            const tvInit = this.bodyInitPositions[i];
            positionAttribute.setX(index, tvInit.x + this.head.position.x);
          }
        }
        positionAttribute.needsUpdate = true;
      }
    }

    function init() {
      scene = new THREE.Scene();
      HEIGHT = window.innerHeight;
      WIDTH = window.innerWidth;
      const aspectRatio = WIDTH / HEIGHT;
      const fieldOfView = 60;
      const nearPlane = 1;
      const farPlane = 2000;
      camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
      );
      camera.position.z = 800;
      camera.position.y = 0;
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(WIDTH, HEIGHT);
      renderer.shadowMap.enabled = true;
      container = worldRef.current;
      if (container) container.appendChild(renderer.domElement);
      windowHalfX = WIDTH / 2;
      windowHalfY = HEIGHT / 2;
    }

    function createLights() {
      const hemisphereLight = new THREE.HemisphereLight(
        0xffffff,
        0xffffff,
        0.8
      );

      const shadowLight = new THREE.DirectionalLight(0xffffff, 3);
      shadowLight.position.set(200, 200, 200);
      shadowLight.castShadow = true;
      shadowLight.shadow.camera.left = -400;
      shadowLight.shadow.camera.right = 400;
      shadowLight.shadow.camera.top = 400;
      shadowLight.shadow.camera.bottom = -400;
      shadowLight.shadow.camera.near = 1;
      shadowLight.shadow.camera.far = 1000;
      shadowLight.shadow.mapSize.width = 2048;
      shadowLight.shadow.mapSize.height = 2048;

      const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
      backLight.position.set(-100, 200, 50);
      backLight.castShadow = true;

      scene.add(hemisphereLight);
      scene.add(shadowLight);
      scene.add(backLight);
    }

    function createFloor() {
      floor = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 500),
        new THREE.MeshBasicMaterial({
          color: 0xebe5e7,
          transparent: true,
          opacity: 0,
        })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -100;
      floor.receiveShadow = true;
      scene.add(floor);
    }

    function createLion() {
      lion = new Lion();
      scene.add(lion.threegroup);
    }

    function createFan() {
      fan = new Fan();
      fan.threegroup.position.z = 350;
      scene.add(fan.threegroup);
    }

    function rule3(
      v: number,
      vmin: number,
      vmax: number,
      tmin: number,
      tmax: number
    ) {
      const nv = Math.max(Math.min(v, vmax), vmin);
      const dv = vmax - vmin;
      const pc = (nv - vmin) / dv;
      const dt = tmax - tmin;
      const tv = tmin + pc * dt;
      return tv;
    }

    function handleMouseMove(event: MouseEvent) {
      mousePos = { x: event.clientX - 520, y: event.clientY + 150 };
    }

    function handleMouseDown() {
      isBlowing = true;
    }

    function handleMouseUp() {
      isBlowing = false;
    }

    function handleTouchStart(event: TouchEvent) {
      if (event.touches.length > 1) {
        event.preventDefault();
        mousePos = { x: event.touches[0].pageX, y: event.touches[0].pageY };
        isBlowing = true;
      }
    }

    function handleTouchEnd() {
      isBlowing = false;
    }

    function handleTouchMove(event: TouchEvent) {
      if (event.touches.length === 1) {
        event.preventDefault();
        mousePos = { x: event.touches[0].pageX, y: event.touches[0].pageY };
        isBlowing = true;
      }
    }

    function onWindowResize() {
      HEIGHT = window.innerHeight;
      WIDTH = window.innerWidth;
      windowHalfX = WIDTH / 2;
      windowHalfY = HEIGHT / 2;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    }

    function loop() {
      deltaTime = clock.getDelta();
      time += deltaTime;
      const xTarget = mousePos.x - windowHalfX;
      const yTarget = mousePos.y - windowHalfY;

      fan.isBlowing = isBlowing;
      fan.update(xTarget, yTarget, deltaTime);
      if (isBlowing) {
        lion.cool(xTarget, yTarget, deltaTime);
      } else {
        lion.look(xTarget, yTarget);
      }
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }

    // Initialize everything
    init();
    createLights();
    createFloor();
    createLion();
    createFan();

    // Add event listeners
    window.addEventListener("resize", onWindowResize);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchmove", handleTouchMove);

    // Start animation loop
    loop();

    // Cleanup
    return () => {
      window.removeEventListener("resize", onWindowResize);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      if (worldRef.current) {
        worldRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div id="world" ref={worldRef}></div>
      <div id="instructions" ref={instructionsRef}>
        Press and drag to make wind
        <br />
        <span className="lightInstructions">
          the lion will surely appreciate
        </span>
      </div>
    </>
  );
};

export default LionComponent;
