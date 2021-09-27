#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use std::process::{Command};
use std::io::{self, Write};

#[tauri::command]
fn exec_proximity(folder_loc: String, proximity: String, deck_file: String,  use_official_art: String, reminder_text: String, debug_op: String, threads_op: String, border_op: String, artist_outline: String, copyright_op: String ) { 
  let cmd = format!("--cards={}", deck_file);
  let art = format!("--use_official_art={}", use_official_art);
  let copy = format!("--copyright={}", copyright_op);
  let reminder_text = format!("--reminder_text={}", reminder_text);
  let threads = format!("--threads={}", threads_op);
  let debug = format!("--debug={}", debug_op);
  let mut border = "black"; 
  if border_op == "false" { 
    border = "none"
  }

  let proxy_ver = format!("{}", proximity);
  let output = Command::new("java")
  .args(&["-jar", &proxy_ver, "--template=normal", &cmd, &art, &copy, &reminder_text, &threads, &debug, &border])
  .output()
  .expect("failed to run proximity");
  // .status()
  // .is_ok(); 
  println!("{}", output.status);
  io::stdout().write_all(&output.stdout).unwrap();
  io::stderr().write_all(&output.stderr).unwrap();
}


#[tauri::command]
fn check_for_java() -> bool { 
  let output = Command::new("java")
            .arg("--version")
            .status()
            .is_ok();
    output.into()
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![check_for_java, exec_proximity])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
