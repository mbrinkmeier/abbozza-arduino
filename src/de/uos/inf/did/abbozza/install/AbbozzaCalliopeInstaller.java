/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.uos.inf.did.abbozza.install;

import de.uos.inf.did.abbozza.tools.GUITool;
import java.awt.Dimension;
import java.awt.Toolkit;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Properties;
import java.util.jar.JarFile;
import java.util.zip.ZipEntry;
import javax.swing.JDialog;
import javax.swing.JFileChooser;
import javax.swing.JOptionPane;
import javax.swing.filechooser.FileFilter;
import javax.swing.text.BadLocationException;
import javax.swing.text.DefaultStyledDocument;
import javax.swing.text.StyledDocument;

/**
 *
 * @author michael
 */
public class AbbozzaCalliopeInstaller extends javax.swing.JFrame {

    // private String toolsDir;
    private String abbozzaDir;
    public Properties prefs;
    private String installDir;

    /**
     * Creates new form AbbozzaInstaller
     */
    public AbbozzaCalliopeInstaller() {
        initComponents();

        String osname = System.getProperty("os.name").toLowerCase();
        if (osname.contains("mac")) {
            // OsX only requires the command 'open'
            browserField.setText("open");
            browserField.setEnabled(false);
            browserButton.setEnabled(false);
        }

        this.setTitle("abbozza! Calliope Installer");
        setDefaultCloseOperation(JDialog.DISPOSE_ON_CLOSE);
        GUITool.centerWindow(this);
        /* Dimension screen = Toolkit.getDefaultToolkit().getScreenSize();
        int x = (screen.width - getWidth()) / 2;
        int y = (screen.height - getHeight()) / 2;
        setLocation(x, y);*/

        abbozzaDir = System.getProperty("user.home") + "/.abbozza/calliope";
        File aD = new File(abbozzaDir);

        if (aD.exists()) {
            int result = JOptionPane.showConfirmDialog(this,
                    "abbozza! Calliope seems to be installed already.\n Continue installation?",
                    "abbozza! Calliope already installed", JOptionPane.YES_NO_OPTION);
            if (result == JOptionPane.NO_OPTION) {
                System.exit(1);
            }
            File prefFile = new File(abbozzaDir + "/abbozza.cfg");
            Properties config = new Properties();
            try {
                config.load(new FileInputStream(prefFile));
                browserField.setText(config.getProperty("browserPath"));
            } catch (Exception e) {
            }
        }
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {
        java.awt.GridBagConstraints gridBagConstraints;

        logoPanel = new javax.swing.JPanel();
        jLabel1 = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        mainPanel = new javax.swing.JPanel();
        jScrollPane1 = new javax.swing.JScrollPane();
        infoPanel = new javax.swing.JTextPane();
        installField = new javax.swing.JTextField();
        jLabel2 = new javax.swing.JLabel();
        sketchbookButton = new javax.swing.JButton();
        jLabel3 = new javax.swing.JLabel();
        browserField = new javax.swing.JTextField();
        browserButton = new javax.swing.JButton();
        buttonPanel = new javax.swing.JPanel();
        cancelButton = new javax.swing.JButton();
        installButton = new javax.swing.JButton();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        setResizable(false);

        logoPanel.setLayout(new java.awt.BorderLayout());

        jLabel1.setIcon(new javax.swing.ImageIcon(getClass().getResource("/de/uos/inf/did/abbozza/install/abbozza200.png"))); // NOI18N
        jLabel1.setToolTipText("abbozza! logo");
        logoPanel.add(jLabel1, java.awt.BorderLayout.LINE_START);

        jLabel5.setIcon(new javax.swing.ImageIcon(getClass().getResource("/de/uos/inf/did/abbozza/img/calliope_logo_small.png"))); // NOI18N
        logoPanel.add(jLabel5, java.awt.BorderLayout.EAST);

        jLabel4.setFont(new java.awt.Font("Dialog", 0, 10)); // NOI18N
        jLabel4.setHorizontalAlignment(javax.swing.SwingConstants.RIGHT);
        jLabel4.setText(AbbozzaInstaller.VERSION);
        jLabel4.setVerticalAlignment(javax.swing.SwingConstants.TOP);
        jLabel4.setHorizontalTextPosition(javax.swing.SwingConstants.RIGHT);
        jLabel4.setVerticalTextPosition(javax.swing.SwingConstants.BOTTOM);
        logoPanel.add(jLabel4, java.awt.BorderLayout.PAGE_START);

        getContentPane().add(logoPanel, java.awt.BorderLayout.PAGE_START);
        logoPanel.getAccessibleContext().setAccessibleName("logoPanel");
        logoPanel.getAccessibleContext().setAccessibleDescription("");

        mainPanel.setBorder(javax.swing.BorderFactory.createEmptyBorder(5, 5, 15, 5));
        java.awt.GridBagLayout mainPanelLayout = new java.awt.GridBagLayout();
        mainPanelLayout.columnWidths = new int[] {430, 50};
        mainPanelLayout.rowHeights = new int[] {180, 15, 30, 30, 30, 30};
        mainPanel.setLayout(mainPanelLayout);

        infoPanel.setEditable(false);
        infoPanel.setFont(new java.awt.Font("Dialog", 0, 10)); // NOI18N
        infoPanel.setText("\nHerzlich Willkommen!\n\nabbozza! Calliope erfordert Java 1.7 oder höher.\n\nAußerdem benötigt abbozza! Calliope einen JavaScript-fähigen Browser.\nVorzugsweise Google Chrome, da er am besten getestet worden ist.\n\nVielen Dank, dass Sie abbozza! Calliope benutzen!\n\nDas abbozza! Team\n");
        infoPanel.setFocusable(false);
        jScrollPane1.setViewportView(infoPanel);

        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 0;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        mainPanel.add(jScrollPane1, gridBagConstraints);

        installField.setText(System.getProperty("user.home")+"/abbozza");
        installField.setToolTipText("Das Sketchbook-Verzeichnis");
        installField.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                installFieldActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 3;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        mainPanel.add(installField, gridBagConstraints);

        jLabel2.setFont(new java.awt.Font("Dialog", 0, 12)); // NOI18N
        jLabel2.setText("Das Sketchbook-Verzeichnis für die Installation:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 2;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        gridBagConstraints.anchor = java.awt.GridBagConstraints.SOUTH;
        mainPanel.add(jLabel2, gridBagConstraints);
        jLabel2.getAccessibleContext().setAccessibleName("Das Zielverzeichnis für die Installation:");

        sketchbookButton.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                installDirButtonActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 3;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        mainPanel.add(sketchbookButton, gridBagConstraints);

        jLabel3.setFont(new java.awt.Font("Dialog", 0, 12)); // NOI18N
        jLabel3.setText("Der von abbozza! verwendete Browser:");
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 4;
        gridBagConstraints.gridwidth = 2;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        mainPanel.add(jLabel3, gridBagConstraints);
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 0;
        gridBagConstraints.gridy = 5;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        mainPanel.add(browserField, gridBagConstraints);

        browserButton.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                browserButtonActionPerformed(evt);
            }
        });
        gridBagConstraints = new java.awt.GridBagConstraints();
        gridBagConstraints.gridx = 1;
        gridBagConstraints.gridy = 5;
        gridBagConstraints.fill = java.awt.GridBagConstraints.BOTH;
        mainPanel.add(browserButton, gridBagConstraints);

        getContentPane().add(mainPanel, java.awt.BorderLayout.CENTER);

        buttonPanel.setLayout(new java.awt.FlowLayout(java.awt.FlowLayout.RIGHT));

        cancelButton.setText("Abbrechen");
        cancelButton.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                cancelButtonActionPerformed(evt);
            }
        });
        buttonPanel.add(cancelButton);

        installButton.setText("Installieren");
        installButton.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                installButtonActionPerformed(evt);
            }
        });
        buttonPanel.add(installButton);

        getContentPane().add(buttonPanel, java.awt.BorderLayout.SOUTH);

        pack();
    }// </editor-fold>//GEN-END:initComponents

    private void cancelButtonActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_cancelButtonActionPerformed
        System.exit(0);
    }//GEN-LAST:event_cancelButtonActionPerformed

    private void addInfoMsg(StyledDocument doc, String msg) {
        try {
            doc.insertString(doc.getLength(), msg + "\n", null);
        } catch (BadLocationException ex) {
        }
    }

    private void installButtonActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_installButtonActionPerformed

        File installDir = new File(installField.getText());
        File browserFile = new File(browserField.getText());

        DefaultStyledDocument infoDoc = new DefaultStyledDocument();

        infoPanel.setDocument(infoDoc);
        addInfoMsg(infoDoc, "Installation started ...");

        try {
            // Look for installer jar
            addInfoMsg(infoDoc, "... looking for " + AbbozzaArduinoInstaller.class.getProtectionDomain().getCodeSource().getLocation().toURI());
            JarFile installerJar = new JarFile(new File(AbbozzaArduinoInstaller.class.getProtectionDomain().getCodeSource().getLocation().toURI()));
            addInfoMsg(infoDoc, "... " + installerJar.getName() + " found");

            // Find jar for installation
            ZipEntry abzFile = installerJar.getEntry("files/Abbozza.jar");

            // If file doesn't exists
            if (abzFile == null) {
                addInfoMsg(infoDoc, "... Abbozza.jar not found in archive");
                JOptionPane.showMessageDialog(this, "Abbozza.jar not found in " + installerJar.getName() + "!", "abbozza! installation failed",
                        JOptionPane.ERROR_MESSAGE);
                System.exit(1);
            }

            abbozzaDir = installDir.getAbsolutePath();
            addInfoMsg(infoDoc,"... copying Abbozza.jar to " + abbozzaDir);

            File abzDir = new File(abbozzaDir);
            abzDir.mkdirs();
            addInfoMsg(infoDoc,"... " + abbozzaDir + " created");            
            
            File jar = new File(abbozzaDir + "Abbozza.jar");

            File backup = new File(abbozzaDir + "/Abbozza_" + System.currentTimeMillis() + ".jar_");
            try {
                if (jar.exists()) {
                    addInfoMsg(infoDoc,"... moving old Abbozza.jar to " + backup.getName());                    
                    Files.move(jar.toPath(), backup.toPath(), StandardCopyOption.REPLACE_EXISTING);
                }
                
                jar.createNewFile();
                
                InputStream inp = installerJar.getInputStream(abzFile);
                AbbozzaInstaller.copyToFile(inp,jar);
                addInfoMsg(infoDoc,"... copied Abbozza.jar to " + jar.getName());
            } catch (IOException ex) {
                addInfoMsg(infoDoc,"... could not move Abbozza.jar to " + backup.getName());
                JOptionPane.showMessageDialog(this, "Could not move " + jar.toPath() + " to " + backup.toPath(), "abbozza! installation failed", JOptionPane.ERROR_MESSAGE);
                this.setVisible(false);
                System.exit(1);
            }
            
            // Create configuration file for micropython
            try {
                File prefFile = new File(System.getProperty("user.home") + "/.abbozza/calliope/");
                Properties config = new Properties();
                try {
                    config.load(new FileInputStream(prefFile));
                    addInfoMsg(infoDoc,"... old configuration found");
                } catch (IOException ex) {
                    config = new Properties();
                    addInfoMsg(infoDoc,"... no old configuration found");
                }
                        
                prefFile.mkdirs();
                prefFile = new File(System.getProperty("user.home") + "/.abbozza/calliope/abbozza.cfg");
                prefFile.createNewFile();
                addInfoMsg(infoDoc,"... " + System.getProperty("user.home") + "/.abbozza/calliope/abbozza.cfg created");

                if ( config.size() == 0 ) config.setProperty("freshInstall", "true");
                config.setProperty("browserPath", browserField.getText());
                config.store(new FileOutputStream(prefFile), "abbozza! preferences");

                // Create Script
            } catch (IOException e1) {
                addInfoMsg(infoDoc,"... " + System.getProperty("user.home") + "/.abbozza/calliope/abbozza.cfg could not be created");
            }

            // Create configuration file for calliopeC
            try {
                File prefFile = new File(System.getProperty("user.home") + "/.abbozza/calliopeC/");
                Properties config = new Properties();
                try {
                    config.load(new FileInputStream(prefFile));
                    addInfoMsg(infoDoc,"... old configuration found");
                } catch (IOException ex) {
                    config = new Properties();
                    addInfoMsg(infoDoc,"... no old configuration found");
                }
                        
                prefFile.mkdirs();
                prefFile = new File(System.getProperty("user.home") + "/.abbozza/calliopeC/abbozza.cfg");
                prefFile.createNewFile();
                addInfoMsg(infoDoc,"... " + System.getProperty("user.home") + "/.abbozza/calliopeC/abbozza.cfg created");

                if ( config.size() == 0 ) config.setProperty("freshInstall", "true");
                config.setProperty("browserPath", browserField.getText());
                config.store(new FileOutputStream(prefFile), "abbozza! preferences");

                // Create Script
            } catch (IOException e1) {
                addInfoMsg(infoDoc,"... " + System.getProperty("user.home") + "/.abbozza/calliopeC/abbozza.cfg could not be created");
            }

            // Preparing build systems
            // TODO
            
            // Copying start scripts
            try {
                File scriptFile;
                String osname = System.getProperty("os.name").toLowerCase();
                if (osname.contains("linux") || osname.contains("mac")) {
                    // The script for Linux and Mac OsX are identical
                    scriptFile = new File(abbozzaDir + "/abbozzaCalliope.sh");
                    scriptFile.createNewFile();
                    PrintWriter writer = new PrintWriter(scriptFile);
                    writer.println("#!/bin/sh ");
                    writer.println("cd " + abbozzaDir);
                    writer.println("java -jar Abbozza.jar calliope");
                    scriptFile.setExecutable(true);
                    writer.flush();
                    writer.close();
                    // Writing start script for calliope C
                    scriptFile = new File(abbozzaDir + "/abbozzaCalliopeC.sh");
                    scriptFile.createNewFile();
                    writer = new PrintWriter(scriptFile);
                    writer.println("#!/bin/sh ");
                    writer.println("cd " + abbozzaDir);
                    writer.println("java -jar Abbozza.jar calliopeC");
                    scriptFile.setExecutable(true);
                    writer.flush();
                    writer.close();
                } else if (osname.contains("win")) {
                    scriptFile = new File(abbozzaDir + "\\abbozzaCalliope.bat");
                    scriptFile.createNewFile();
                    PrintWriter writer = new PrintWriter(scriptFile);
                    writer.println("cd " + abbozzaDir);
                    writer.println("java -jar Abbozza.jar calliope");
                    scriptFile.setExecutable(true);
                    writer.flush();
                    writer.close();
                    // Writing start script for Calliope C
                    scriptFile = new File(abbozzaDir + "\\abbozzaCalliopeC.bat");
                    scriptFile.createNewFile();
                    writer = new PrintWriter(scriptFile);
                    writer.println("cd " + abbozzaDir);
                    writer.println("java -jar Abbozza.jar calliopeC");
                    scriptFile.setExecutable(true);
                    writer.flush();
                    writer.close();
                }

            } catch (IOException ex) {
                JOptionPane.showMessageDialog(this, "Das Start-Skript konnte nicht geschrieben werden: " + abbozzaDir + "\\abbozzaCalliope.bat", "Fehler bei der Installation", JOptionPane.INFORMATION_MESSAGE);
                this.setVisible(false);
                System.exit(1);
            }

        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Jar nicht gefunden!", "abbozza! Installationsfehler ",
                    JOptionPane.ERROR_MESSAGE);
            System.exit(1);
        }

        addInfoMsg(infoDoc, "... Installation successful");

        JOptionPane.showMessageDialog(this, "Installation was successful!", "abbozza! Calliope installed", JOptionPane.INFORMATION_MESSAGE);
        this.setVisible(false);
        System.exit(0);
    }//GEN-LAST:event_installButtonActionPerformed

    private void installDirButtonActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_installDirButtonActionPerformed
        JFileChooser chooser = new JFileChooser(installField.getText());
        chooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
        int returnVal = chooser.showOpenDialog(this);
        if (returnVal == JFileChooser.APPROVE_OPTION) {
            installField.setText(chooser.getSelectedFile().getAbsolutePath());
        }
    }//GEN-LAST:event_installDirButtonActionPerformed

    private void browserButtonActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_browserButtonActionPerformed
        JFileChooser chooser = new JFileChooser(browserField.getText());
        int returnVal = chooser.showOpenDialog(this);
        chooser.setFileFilter(new FileFilter() {

            @Override
            public boolean accept(File f) {
                return f.canExecute();
            }

            @Override
            public String getDescription() {
                return "Select executable files";
            }
        });
        if (returnVal == JFileChooser.APPROVE_OPTION) {
            if (chooser.getSelectedFile() != null) {
                browserField.setText(chooser.getSelectedFile().getAbsolutePath());
            }
        }
    }//GEN-LAST:event_browserButtonActionPerformed

    private void installFieldActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_installFieldActionPerformed
        // TODO add your handling code here:
    }//GEN-LAST:event_installFieldActionPerformed

    /**
     * @param args the command line arguments
     */
    public static void main(String args[]) {
        /* Set the Nimbus look and feel */
        //<editor-fold defaultstate="collapsed" desc=" Look and feel setting code (optional) ">
        /* If Nimbus (introduced in Java SE 6) is not available, stay with the default look and feel.
         * For details see http://download.oracle.com/javase/tutorial/uiswing/lookandfeel/plaf.html 
         */
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(AbbozzaCalliopeInstaller.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(AbbozzaCalliopeInstaller.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(AbbozzaCalliopeInstaller.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(AbbozzaCalliopeInstaller.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }
        //</editor-fold>
        //</editor-fold>
        //</editor-fold>
        //</editor-fold>
        //</editor-fold>
        //</editor-fold>
        //</editor-fold>
        //</editor-fold>

        /* Create and display the form */
        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new AbbozzaCalliopeInstaller().setVisible(true);
            }
        });
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton browserButton;
    private javax.swing.JTextField browserField;
    private javax.swing.JPanel buttonPanel;
    private javax.swing.JButton cancelButton;
    private javax.swing.JTextPane infoPanel;
    private javax.swing.JButton installButton;
    private javax.swing.JTextField installField;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel3;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JPanel logoPanel;
    private javax.swing.JPanel mainPanel;
    private javax.swing.JButton sketchbookButton;
    // End of variables declaration//GEN-END:variables
}
