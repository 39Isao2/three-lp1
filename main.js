import './style.css';
import * as THREE from "three";
import * as dat from "lil-gui";


/**
 * uiデバックの実装
 */
const gui = new dat.GUI();



// キャンバスの取得
const canvas = document.querySelector(".webgl");

/**
 * 必須の3要素
 */

// シーン
const scene = new THREE.Scene();

// サイズ
const sizes = {
  width:window.innerWidth,
  height:window.innerHeight
};

//カメラ
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width/sizes.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

const renderer = new THREE.WebGL1Renderer({
  canvas:canvas,
  alpha:true
});
renderer.setSize(sizes.width,sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);


/**
 * オブジェクトを作成しよう
 */
// マテリアル
const material = new THREE.MeshPhysicalMaterial({
  color:"#3c94d7",
  metalness:0.86,
  roughness:0.37,
    flatShading:true
});
/**
 * gulで制御
 */
gui.addColor(material,"color");
gui.add(material,"metalness",0,1,0.01);
gui.add(material,"roughness",0,1,0.01);
// gui.add(material,"flatShading");


// メッシュ
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1,0.4,16,60),material);

const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(),material);

const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8,0.35,100,16),material);

const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(),material);
scene.add(mesh1,mesh2,mesh3,mesh4);

const meshes = [mesh1,mesh2,mesh3,mesh4];

// 回転用に配置
mesh1.position.set(2,0,0);
mesh2.position.set(-1,0,0);
mesh3.position.set(2,0,-6);
mesh4.position.set(5,0,3);

/**
 * パーティクルを作成
 */
const particleGeometry = new THREE.BufferGeometry();
const paticleCounts = 700;
const particleArray = new Float32Array(paticleCounts*3);
for (let i = 0; i < paticleCounts*3; i++) {
  particleArray[i] = (Math.random() - 0.5) * 10;
}
particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(particleArray,3)
);
const particleMaterial = new THREE.PointsMaterial({
  size:0.025,
  color:"#fff"
});
// メッシュ化
const particles = new THREE.Points(particleGeometry,particleMaterial);
scene.add(particles);






/**
 * ライトを追加
 */
 const directionalLight = new THREE.DirectionalLight("#ffffff",4);
 directionalLight.position.set(0.5,1,0);
 scene.add(directionalLight);

 // ブラウザのリサイズ操作
 window.addEventListener("resize",()=>{
  sizes.width =  window.innerWidth;
  sizes.height =  window.innerHeight;

  // カメラのアップデート
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // レンダラーのアップデート
  renderer.setSize(sizes.width,sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
 });


 /**
  * ホイールを実装
  */
 let speed = 0;
 let rotation = 0;
 window.addEventListener("wheel",(event)=>{
  speed += event.deltaY * 0.0002;
  //console.log("ホイールされました");
  //console.log(event.deltaY);
 });
 function rot(){
  rotation+=speed;
  speed*=0.93;

  // ジオメトリ全体を回転させる
  mesh1.position.x = 2 + 3.8 * Math.cos(rotation);
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation);


  mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI/2);
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI/2);

  mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);

  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + (Math.PI/2) * 3);
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + (Math.PI/2) * 3);


  //mesh1.position.x = rotation;
  window.requestAnimationFrame(rot);
 }
 rot();


 /**
  * カーソルの位置を取得しよう
  */
const coursor ={
  x:0,
  y:0
};
window.addEventListener("mousemove",  (event) =>{
  coursor.x = event.clientX / sizes.width - 0.5;
  coursor.y = event.clientY / sizes.height - 0.5;

 // console.log(coursor.x);
 //console.log(coursor.y);
})




// アニメーション
const clock = new THREE.Clock();
const animate = () =>{
  renderer.render(scene,camera);


  let getDeltaTime = clock.getDelta();


  // メッシュを回転
  for (const mesh of meshes) {
    mesh.rotation.x +=0.1 * getDeltaTime;
    mesh.rotation.y +=0.12 * getDeltaTime;
  }


  // カメラの制御をしよう
  camera.position.x = coursor.x * getDeltaTime * 10;
  camera.position.y = coursor.y * getDeltaTime * 10;


  window.requestAnimationFrame(animate);
};

animate();

