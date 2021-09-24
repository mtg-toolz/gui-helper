#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use std::process::{Command, Stdio};

#[tauri::command]
fn check_for_java() { 
  if cfg!(target_os = "windows") {
  let output = 
    Command::new("java")
            .arg("-version")
            .status()
            .is_ok();
    // let stdout = String::from_utf8(output.stdout).unwrap();
    // println!("{}", output)
} else {
    let output = Command::new("sh")
            .arg("java -version")
            .stdout(Stdio::piped())
            .output()
            .unwrap();
    let stdout = String::from_utf8(output.stdout).unwrap();
    println!("{}", stdout)
};
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![check_for_java])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
