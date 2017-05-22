/**
 * @license
 * abbozza!
 *
 * Copyright 2015 Michael Brinkmeier ( michael.brinkmeier@uni-osnabrueck.de )
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
/**
 * @fileoverview This abbozza! monitor displaqys the channel data as a table.
 * @author michael.brinkmeier@uni-osnabrueck.de (Michael Brinkmeier)
 */

package de.uos.inf.did.abbozza.monitor;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.JFileChooser;
import javax.swing.JPopupMenu;
import javax.swing.filechooser.FileNameExtensionFilter;
import javax.swing.table.DefaultTableModel;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

/**
 *
 * @author mbrinkmeier
 */
public class TableMonitor extends MonitorPanel {

    private TableMonitorModel tableModel;
    private File lastSave = null;

    public TableMonitorModel getTableModel() {
        return tableModel;
    }

    public void setTableModel(TableMonitorModel valueTable) {
        this.tableModel = valueTable;
    }
    private StringBuffer buffer;
    
    /**
     * Creates new form TableMonitor
     */
    public TableMonitor() {
        initComponents();
        buffer = new StringBuffer();
        tableModel = new TableMonitorModel();
        table.setModel(tableModel);
        table.addMouseListener(new MonitorMouseListener(this));
    }

    /**
     * This method is called from within the constructor to initialize the form.
     * WARNING: Do NOT modify this code. The content of this method is always
     * regenerated by the Form Editor.
     */
    @SuppressWarnings("unchecked")
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        popup = new javax.swing.JPopupMenu();
        saveItem = new javax.swing.JMenuItem();
        resetItem = new javax.swing.JMenuItem();
        jScrollPane1 = new javax.swing.JScrollPane();
        table = new javax.swing.JTable();

        saveItem.setText("Speichern");
        saveItem.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                saveItemActionPerformed(evt);
            }
        });
        popup.add(saveItem);

        resetItem.setText("Löschen");
        resetItem.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                resetItemActionPerformed(evt);
            }
        });
        popup.add(resetItem);

        setLayout(new java.awt.BorderLayout());

        table.setModel(new javax.swing.table.DefaultTableModel(
            new Object [][] {
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null},
                {null, null, null, null}
            },
            new String [] {
                "Title 1", "Title 2", "Title 3", "Title 4"
            }
        ));
        jScrollPane1.setViewportView(table);

        add(jScrollPane1, java.awt.BorderLayout.CENTER);
    }// </editor-fold>//GEN-END:initComponents

    private void saveItemActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_saveItemActionPerformed
        String path = ((lastSave != null) ? lastSave.getAbsolutePath() : System.getProperty("user.home"));
        JFileChooser chooser = new JFileChooser(path);
        chooser.setFileFilter(new FileNameExtensionFilter("abbozza! data (*.abd)", "abd"));
        if (chooser.showSaveDialog(null) == JFileChooser.APPROVE_OPTION) {
            File file = chooser.getSelectedFile();
            if (!file.getName().endsWith(".abd") && !file.getName().endsWith(".ABD")) {
                file = new File(file.getPath() + ".abd");
                lastSave = file;
            }
            
            FileWriter writer;
            
            try {
                writer = new FileWriter(file);
                tableModel.save(writer);
                writer.close();
            } catch (IOException ex) {
                Logger.getLogger(TableMonitor.class.getName()).log(Level.SEVERE, null, ex);
            }
        
        }
    }//GEN-LAST:event_saveItemActionPerformed

    private void resetItemActionPerformed(java.awt.event.ActionEvent evt) {//GEN-FIRST:event_resetItemActionPerformed
        tableModel.clear();
    }//GEN-LAST:event_resetItemActionPerformed


    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JPopupMenu popup;
    private javax.swing.JMenuItem resetItem;
    private javax.swing.JMenuItem saveItem;
    private javax.swing.JTable table;
    // End of variables declaration//GEN-END:variables

    @Override
    public void processMessage(String s) {
        /**
         * 
         * The values are expected in the following form:
         * <types>,<timestamp>,<value0>,<value1>,<value2>,<value3>,<value4>
         * 
         **/

        try {
            StringBuffer buf = new StringBuffer(s);
        
            int idx = buf.indexOf(",");
            if ( idx < 0 ) return;
            String types = buf.substring(0,idx);
            buf.delete(0,idx+1);
            tableModel.setTypes(types);
            
            idx = buf.indexOf(",");
            if ( idx < 0 ) return;
            String ts = buf.substring(0,idx);
            buf.delete(0,idx+1);
            long timestamp = Long.parseLong(ts);

            String val;
            int[] values = new int[5];
        
            for (int i = 0; i < 4 ; i++) {
                idx = buf.indexOf(",");
                    if ( idx < 0 ) return;
                val = buf.substring(0,idx);
                buf.delete(0,idx+1);
                values[i] = Integer.parseInt(val);
            }
            values[4] = Integer.parseInt(buf.toString());
                
            tableModel.addRow(timestamp, values);
        } catch (Exception ex) {
            // ex.printStackTrace(System.out);
        }
    }
    
    public long getTimestamp(int row) {
        Long l = (Long) tableModel.getValueAt(row,0);
        return l.longValue();
    }
    
    public short getValue(int row, int channel) {
        Short s = (Short) tableModel.getValueAt(row,channel+1);
        return s.shortValue();        
    }
    
    public String getName() {
        return "Tabelle";
    }

    @Override
    public JPopupMenu getPopUp() {
        return popup;
    }
    
}
