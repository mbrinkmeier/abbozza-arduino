/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package de.uos.inf.did.abbozza.plugin;

import de.uos.inf.did.abbozza.AbbozzaConfig;
import de.uos.inf.did.abbozza.AbbozzaConfigPanel;
import de.uos.inf.did.abbozza.AbbozzaLocale;
import de.uos.inf.did.abbozza.AbbozzaLogger;
import de.uos.inf.did.abbozza.AbbozzaServer;
import de.uos.inf.did.abbozza.Tools;
import de.uos.inf.did.abbozza.install.InstallTool;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Font;
import java.awt.GridLayout;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.BorderFactory;
import javax.swing.DefaultListModel;
import javax.swing.JLabel;
import javax.swing.JList;
import javax.swing.JPanel;
import javax.swing.JTextArea;
import javax.swing.ListCellRenderer;
import javax.swing.ListModel;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 *
 * @author michael
 */
public class PluginConfigPanel extends AbbozzaConfigPanel implements ListCellRenderer {

    /**
     * Creates new form PluginConfigPanel
     */
    public PluginConfigPanel() {
        initComponents();
        reloadPlugins();
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        urlComboBox = new javax.swing.JComboBox<String>();
        jLabel1 = new javax.swing.JLabel();
        jScrollPane1 = new javax.swing.JScrollPane();
        pluginList = new javax.swing.JList<Node>();
        installButton = new javax.swing.JButton();

        urlComboBox.setModel(new javax.swing.DefaultComboBoxModel(new String[] { "http://inf-didaktik.rz.uos.de/downloads/abbozza/plugins/plugins.xml" }));
        urlComboBox.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                urlComboBoxActionPerformed(evt);
            }
        });

        jLabel1.setText(AbbozzaLocale.entry("gui.plugin_url"));

        jScrollPane1.setHorizontalScrollBarPolicy(javax.swing.ScrollPaneConstants.HORIZONTAL_SCROLLBAR_NEVER);

        pluginList.setModel(new DefaultListModel<Node>());
        pluginList.setSelectionMode(javax.swing.ListSelectionModel.SINGLE_SELECTION);
        pluginList.setCellRenderer(this);
        pluginList.addListSelectionListener(new javax.swing.event.ListSelectionListener() {
            public void valueChanged(javax.swing.event.ListSelectionEvent evt) {
                pluginListValueChanged(evt);
            }
        });
        jScrollPane1.setViewportView(pluginList);

        installButton.setText(AbbozzaLocale.entry("gui.install"));
        installButton.setEnabled(false);
        installButton.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                installButtonActionPerformed(evt);
            }
        });

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(this);
        this.setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(jScrollPane1, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, 376, Short.MAX_VALUE)
                    .addComponent(urlComboBox, 0, 0, Short.MAX_VALUE)
                    .addGroup(layout.createSequentialGroup()
                        .addComponent(jLabel1)
                        .addGap(0, 0, Short.MAX_VALUE))
                    .addGroup(javax.swing.GroupLayout.Alignment.TRAILING, layout.createSequentialGroup()
                        .addGap(0, 0, Short.MAX_VALUE)
                        .addComponent(installButton)))
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addGap(5, 5, 5)
                .addComponent(jLabel1)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(urlComboBox, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jScrollPane1, javax.swing.GroupLayout.PREFERRED_SIZE, 207, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(installButton)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
    }// </editor-fold>//GEN-END:initComponents

    private void urlComboBoxActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_urlComboBoxActionPerformed
        reloadPlugins();
    }//GEN-LAST:event_urlComboBoxActionPerformed

    private void installButtonActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_installButtonActionPerformed
        String url = "";
        try {
            Node node = this.pluginList.getSelectedValue();
            url = node.getAttributes().getNamedItem("url").getTextContent();
            installPlugin(new URL(url));
        } catch (MalformedURLException ex) {
            AbbozzaLogger.err("Malformed URL : " + url);
        }
    }//GEN-LAST:event_installButtonActionPerformed

    private void pluginListValueChanged(javax.swing.event.ListSelectionEvent evt) {//GEN-FIRST:event_pluginListValueChanged
        Node node =  this.pluginList.getSelectedValue();
        if ( node != null) {
            this.installButton.setEnabled(true);
        } else {
            if ( checkPlugin(node.getAttributes().getNamedItem("id").getTextContent()) ) {
                this.installButton.setText(AbbozzaLocale.entry("gui.reinstall"));
            } else {
                this.installButton.setText(AbbozzaLocale.entry("gui.install"));                
            }
            this.installButton.setEnabled(false);
            
        }
    }//GEN-LAST:event_pluginListValueChanged

    public boolean checkPlugin(String id) {
        Plugin plugin = AbbozzaServer.getPluginManager().getPlugin(id);
        if ( plugin != null ) {
            return true;
        }
        return false;
    }

    @Override
    public void storeConfiguration(AbbozzaConfig config) {
    }


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JButton installButton;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JList<Node> pluginList;
    private javax.swing.JComboBox<String> urlComboBox;
    // End of variables declaration//GEN-END:variables

    @Override
    public String getName() {
        return AbbozzaLocale.entry("gui.plugin_panel");
    }

    private void reloadPlugins() {
        try {
            String urlString = (String) urlComboBox.getSelectedItem();
            URL url = new URL(urlString);
            Document pluginsXml = Tools.getXml(url);
            if (pluginsXml == null) {
                return;
            }
            
            DefaultListModel<Node> list = new DefaultListModel<Node>();
            NodeList plugins = pluginsXml.getElementsByTagName("plugin");
            for (int idx = 0; idx < plugins.getLength(); idx++ ) {
                Node plugin = plugins.item(idx);
                list.addElement(plugin);
            }
            pluginList.setModel(list);
            
        } catch (MalformedURLException ex) {
            Logger.getLogger(PluginConfigPanel.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(PluginConfigPanel.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    @Override
    public Component getListCellRendererComponent(JList list, Object value, int index, boolean isSelected, boolean cellHasFocus) {
        Node node = (Node) value;
        String name = "???";
        String desc = "???";
        String requires = "";
        String id = node.getAttributes().getNamedItem("id").getTextContent();
        String url = node.getAttributes().getNamedItem("url").getTextContent();
        NodeList children = node.getChildNodes();
        for (int idx = 0; idx < children.getLength(); idx++ ) {
            Node child = children.item(idx);
            if (child.getNodeName().equals("name")) {
                name = child.getTextContent();
            } else if (child.getNodeName().equals("description")) {
                desc = child.getTextContent().trim();
            } else if (child.getNodeName().equals("requires")) {
                String lib = child.getTextContent().trim();
                if ( requires.length() > 0 ) {
                    requires = requires + ", ";
                }
                requires = requires + lib;
            }
        }
        

        if ( requires.length() > 0 ) {
            desc = desc + "\n\nRequired libraries: " + requires;
        }

        PluginPanel pluginPanel = new PluginPanel(name,url,desc,id,this, isSelected);
        
        return pluginPanel;
    }
    
    
    public void installPlugin(URL url) {
        String pluginPath = AbbozzaServer.getInstance().getLocalPluginPath();
        File dir = new File(pluginPath);
        dir.mkdir();
        String name = new File(url.getFile()).getName();
        File file = new File(pluginPath + "/" + name);
        try {
            Files.copy(url.openConnection().getInputStream(), file.toPath(), StandardCopyOption.REPLACE_EXISTING);
            // InstallTool.getInstallTool().writeToFile(url.openConnection().getInputStream(),file);
            File[] jars = new File[1];
            jars[0] = file;
            AbbozzaServer.getPluginManager().addJars(jars);
        } catch (IOException ex) {
            AbbozzaLogger.err("Can't write to " + file.getAbsolutePath());
        }
        
    }
    
}
