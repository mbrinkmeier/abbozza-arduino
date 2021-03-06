/**
 * @license abbozza!
 *
 * Copyright 2015 Michael Brinkmeier ( michael.brinkmeier@uni-osnabrueck.de )
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the Licenseo. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
/**
 * @fileoverview The main class for the abbozza! server
 * @author michael.brinkmeier@uni-osnabrueck.de (Michael Brinkmeier)
 */
package de.uos.inf.did.abbozza.arduino;

import cc.arduino.packages.BoardPort;
import de.uos.inf.did.abbozza.handler.JarDirHandler;
import java.awt.Color;

import processing.app.Editor;
import processing.app.PreferencesData;
import processing.app.tools.Tool;

import com.sun.net.httpserver.*;
import de.uos.inf.did.abbozza.core.AbbozzaConfigDialog;
import de.uos.inf.did.abbozza.core.AbbozzaLocale;
import de.uos.inf.did.abbozza.core.AbbozzaLogger;
import de.uos.inf.did.abbozza.core.AbbozzaServer;
import de.uos.inf.did.abbozza.arduino.handler.BoardHandler;
import de.uos.inf.did.abbozza.core.AbbozzaServerException;
import de.uos.inf.did.abbozza.core.AbbozzaVersion;
import de.uos.inf.did.abbozza.handler.SerialHandler;
import de.uos.inf.did.abbozza.install.InstallTool;
import de.uos.inf.did.abbozza.plugin.PluginConfigPanel;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintStream;
import java.lang.reflect.InvocationTargetException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.SwingUtilities;
import jssc.SerialPort;
import processing.app.Base;
import processing.app.BaseNoGui;
import processing.app.packages.UserLibrary;

public class Abbozza extends AbbozzaServer implements Tool, HttpHandler {

    public static Color COLOR = new Color(91, 103, 165);
    private static int counter;

    private int arduino_major;
    private int arduino_minor;
    private int arduino_rev;

    private Editor editor;

    public static URI jarUri;
    public static URI jarCommonUri;

    public static boolean isGlobal;
    public static boolean localExists;
    public static String name;

    // During class load check is this calss is loaded from the global tool jar
    static {
        isGlobal = true;
        localExists = false;
        jarUri = null;
        try {
            // Get jar file
            jarUri = Abbozza.class.getProtectionDomain().getCodeSource().getLocation().toURI();
            System.out.println("abbozza!: Initializing " + jarUri.getPath());
            jarCommonUri = AbbozzaServer.class.getProtectionDomain().getCodeSource().getLocation().toURI();
            System.out.println("abbozza!: Initializing " + jarCommonUri.getPath());

            // Get 
            File sketchbookFolder = BaseNoGui.getSketchbookFolder();
            System.out.println("abbozza!: Checking sketchbook folder: " + sketchbookFolder.toURI().toString());
            File localJar = new File(sketchbookFolder, "/tools/Abbozza/tool/abbozza-arduino.jar");
            if (localJar.exists()) {
                System.out.println("abbozza!: LOCAL jar found at " + localJar.toURI().toString());
                localExists = true;
                if (localJar.toURI().toString().startsWith(jarUri.toString())) {
                    isGlobal = false;
                } else {
                    isGlobal = true;
                    System.out.println("abbozza!: GLOBAL jar found at " + jarUri.toString());
                }
            } else {
                isGlobal = true;
                System.out.println("abbozza!: GLOBAL jar found at " + jarUri.toString());
            }
        } catch (URISyntaxException ex) {
        }

        if (jarUri == null) {
            System.out.println("abbozza! in panic! Cannot find abbozza-arduino.jar!");
            System.exit(1);
        }
    }

    @Override
    public void init(Editor editor) {

        if (isGlobal && localExists) {
            System.out.println("Suppressing global abbozza! tool, since local version exists!");
            return;
        }

        String version = BaseNoGui.VERSION_NAME;
        int pos = version.indexOf('.');
        arduino_major = Integer.parseInt(version.substring(0, pos));
        int pos2 = version.indexOf('.', pos + 1);
        arduino_minor = Integer.parseInt(version.substring(pos + 1, pos2));
        arduino_rev = Integer.parseInt(version.substring(pos2 + 1));
        AbbozzaLogger.out("Found arduino version " + arduino_major + "." + arduino_minor + "." + arduino_rev, AbbozzaLogger.INFO);

        this.editor = editor;

        super.init("arduino");

        if (config.startAutomatically()) {
            // Try to start server on given port
            int serverPort = config.getServerPort();
            try {
              this.startServer(serverPort);
            } catch (AbbozzaServerException ex) {
              JOptionPane.showMessageDialog(null, AbbozzaLocale.entry("msg.already_running"),"",JOptionPane.ERROR_MESSAGE);
              AbbozzaLogger.err(ex.getMessage());
              return;
            }

            if (config.startBrowser()) {
                startBrowser("arduino.html");
            }
        }
    }

    @Override
    public void run() {
        if (isGlobal && localExists) {
            System.out.println("Suppressing global abbozza! tool, since local version exists!");
            return;
        }

        // Do not start a second Abbozza instance!
        if (Abbozza.getInstance() != this) {
            return;
        }

        // Try to start server on given port
        int serverPort = config.getServerPort();
        try {
          this.startServer(serverPort);
        } catch (AbbozzaServerException ex) {
          AbbozzaLogger.err(ex.getMessage());
          JOptionPane.showMessageDialog(null, AbbozzaLocale.entry("msg.already_running"),"",JOptionPane.ERROR_MESSAGE);
          return;
        }
    
        startBrowser("arduino.html");
    }

    
    @Override
    public void setPaths() {
        super.setPaths();
        sketchbookPath = PreferencesData.get("sketchbook.path");
        sketchbookPath = InstallTool.expandPath(sketchbookPath);
        // if (sketchbookPath.contains("%HOME%")) {
        //     sketchbookPath = sketchbookPath.replace("%HOME%", System.getProperty("user.home"));
        // }
        // configPath = sketchbookPath + "/tools/Abbozza/Abbozza.cfg";
        localJarPath = sketchbookPath + "/tools/Abbozza/tool/";
        globalJarPath = PreferencesData.get("runtime.ide.path") + "/";
        abbozzaPath = globalJarPath;

        localPluginPath = sketchbookPath + "/tools/Abbozza/plugins";
        globalPluginPath = globalJarPath + "/tools/Abbozza/plugins";
    }

    @Override
    public void registerSystemHandlers() {
        httpServer.createContext("/abbozza/board", new BoardHandler(this, false));
        httpServer.createContext("/abbozza/queryboard", new BoardHandler(this, true));
        httpServer.createContext("/abbozza/serial", new SerialHandler(this));
    }

    public void serialMonitor() {
        this.editor.handleSerial();
    }

    public void findJarsAndDirs(JarDirHandler jarHandler) {
        jarHandler.addDir(sketchbookPath + "/tools/Abbozza", "Local directory");
        // jarHandler.addJar(sketchbookPath + "/tools/Abbozza/tool/abbozza-arduino.jar", "Local jar");
        jarHandler.addDir(abbozzaPath + "tools/Abbozza", "Global directory");
        // jarHandler.addJar(runtimePath + "tools/Abbozza/tool/abbozza-arduino.jar", "Global jar");
        jarHandler.addJar(jarUri, "Jar");        
        jarHandler.addJar(jarCommonUri, "Jar common");        
    }

    public void adaptConfigDialog(AbbozzaConfigDialog dialog) {
        dialog.addPanel(new PluginConfigPanel());
    }

    public void print(String message) {
        AbbozzaLogger.out(message);
    }

    public void processMessage(String message) {
        this.editor.getCurrentTab().setText(message);
        // this.editor.setText(message);
    }

    @Override
    public String getMenuTitle() {
        if (isGlobal && localExists) {
            System.out.println("Suppressing global abbozza! tool, since local version exists!");
            return "abbozza! (deactivated)";
        }
        return "abbozza!";
    }

    public Editor getEditor() {
        return editor;
    }

    // Moves the arduino IDE window to the back
    @Override
    public void toolToBack() {
        editor.toBack();
    }

    @Override
    public void toolIconify() {
        editor.setState(JFrame.ICONIFIED);
        editor.setExtendedState(JFrame.ICONIFIED);
    }

    @Override
    public void toolSetCode(String code) {
        setEditorText(code);
    }

    private void setEditorText(final String code) {
        try {
            SwingUtilities.invokeAndWait(new Runnable() {
                public void run() {
                    editor.getCurrentTab().setText(code);
                }
            });
        } catch (InterruptedException ex) {
            Logger.getLogger(Abbozza.class.getName()).log(Level.SEVERE, null, ex);
        } catch (InvocationTargetException ex) {
            Logger.getLogger(Abbozza.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    @Override
    public int compileCode(String code) {

        compileMsg = "";
        compileErrorMsg = "";

        String result = null;

        toolSetCode(code);

        // Redirect error stream
        PrintStream origErr = System.err;
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        PrintStream newErr = new PrintStream(buffer);
        System.setErr(newErr);

        // Compile sketch                
        try {
            AbbozzaLogger.out(AbbozzaLocale.entry("msg.compiling"), AbbozzaLogger.INFO);
            editor.statusNotice("abbozza!: " + AbbozzaLocale.entry("msg.compiling"));
            result = editor.getSketchController().build(false, false);
            editor.statusNotice("abbozza!: " + AbbozzaLocale.entry("msg.done_compiling"));
            AbbozzaLogger.out(AbbozzaLocale.entry("msg.done_compiling"), AbbozzaLogger.INFO);
        } catch (Exception e) {
            // e.printStackTrace(System.out);
            editor.statusError(e);
            editor.statusNotice("abbozza!: " + AbbozzaLocale.entry("msg.error_compiling"));
            AbbozzaLogger.out(AbbozzaLocale.entry("msg.error_compiling"), AbbozzaLogger.INFO);
        }

        // Reset error stream
        newErr.flush();
        System.setErr(origErr);

        // Fetch response
        compileErrorMsg = buffer.toString();

        if (result != null) {
            return 0;
        } else {
            return 1;
        }
    }

    @Override
    public int uploadCode(String code) {

        boolean flag = PreferencesData.getBoolean("editor.save_on_verify");
        PreferencesData.setBoolean("editor.save_on_verify", false);

        ThreadGroup group = Thread.currentThread().getThreadGroup();
        Thread[] threads = new Thread[group.activeCount()];
        group.enumerate(threads, false);

        monitorHandler.suspend();

        toolSetCode(code);

        // Redirect error stream
        PrintStream origErr = System.err;
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        PrintStream newErr = new PrintStream(buffer);
        System.setErr(newErr);

        try {
            AbbozzaLogger.out(AbbozzaLocale.entry("msg.compiling"), AbbozzaLogger.INFO);
            editor.handleExport(false);
            AbbozzaLogger.out(AbbozzaLocale.entry("msg.done_compiling"), AbbozzaLogger.INFO);
        } catch (Exception e) {
            editor.statusError(e);
            AbbozzaLogger.out(AbbozzaLocale.entry("msg.error_compiling"), AbbozzaLogger.INFO);
        }

        Thread[] threads2 = new Thread[group.activeCount()];
        group.enumerate(threads2, false);

        // Find the exporting thread
        Thread last = null;
        int j;

        int i = threads2.length - 1;
        while ((i >= 0) && (last == null)) {

            j = threads.length - 1;
            while ((j >= 0) && (threads[j] != threads2[i])) {
                j--;
            }

            if (j < 0) {
                last = threads2[i];
            }
            i--;
        }

        // Wait for the termination of the export thread
        AbbozzaLogger.out("Waiting for upload", AbbozzaLogger.INFO);
        while ((last != null) && (last.isAlive())) {
        }
        AbbozzaLogger.out("Upload ended", AbbozzaLogger.INFO);

        PreferencesData.setBoolean("editor.save_on_verify", flag);

        // Reset error stream
        newErr.flush();
        System.setErr(origErr);

        // Fetch response
        compileErrorMsg = buffer.toString();
        AbbozzaLogger.out(compileErrorMsg, AbbozzaLogger.INFO);

        if (compileErrorMsg.contains("error")) {
            return 1;
        }
        return 0;

    }

    public boolean checkLibrary(String name) {
        UserLibrary lib = Base.getLibraries().getByName(name);
        if (lib != null) {
            return true;
        }
        return false;
    }

    public String getSerialPort() {
        BoardPort port = Base.getDiscoveryManager().find(PreferencesData.get("serial.port"));
        if (port != null) {
            return port.getAddress();
        }

        return null;
    }

    public int getBaudRate() {
        return SerialPort.BAUDRATE_115200;
    }

    @Override
    public String findBoard() {
        return "";
    }

    @Override
    public File queryPathToBoard(String path) {
        return new File(path);
    }

    public String getSystemVersion() {
        return AbbozzaVersion.asString();
    }

    ;

    @Override
    public boolean installPluginFile(InputStream stream, String name) {
        File target = new File(sketchbookPath + "/libraries/Abbozza/" + name);
        try {
            AbbozzaLogger.info("Copying " + name + " to " + target.toString());
            Files.copy(stream, target.toPath(), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            AbbozzaLogger.err("Could not copy " + name + " to " + target.toString());
            return false;
        }
        return true;
    }

    @Override
    public void installUpdate(String version, String updateUrl) {
        try {
            // 1st step: Rename current jar
            // Find current jar
            URL curUrl = AbbozzaServer.class.getProtectionDomain().getCodeSource().getLocation();
            File cur = new File(curUrl.toURI());
            AbbozzaLogger.out("Current jar found at " + cur.getAbsolutePath(), AbbozzaLogger.INFO);
            SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
            String today = format.format(new Date());
            File dir = new File(cur.getParentFile().getAbsolutePath());
            if (!dir.exists()) {
                AbbozzaLogger.out("Creating directory " + dir.getPath(), AbbozzaLogger.INFO);
                dir.mkdir();
            }
            AbbozzaLogger.out("Moving old version to " + dir.getPath() + "/Abbozza." + today + ".jar", AbbozzaLogger.INFO);
            cur.renameTo(new File(dir.getPath() + "/Abbozza." + today + ".jar"));
            
            // 2nd step: Download new version
            AbbozzaLogger.out("Downloading version " + version, AbbozzaLogger.INFO);
            URL url = new URL(updateUrl + "abbozza-arduino.jar");
            URLConnection conn = url.openConnection();
            byte buffer[] = new byte[4096];
            int n = -1;
            InputStream ir = conn.getInputStream();
            FileOutputStream ow = new FileOutputStream(new File(curUrl.toURI()));
            while ((n = ir.read(buffer)) != -1) {
                ow.write(buffer, 0, n);
            }
            ow.close();
            ir.close();
            AbbozzaLogger.out("Stopping Arduino IDE", AbbozzaLogger.INFO);
            System.exit(0);
        } catch (Exception ex) {
            Logger.getLogger(AbbozzaServer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

}
