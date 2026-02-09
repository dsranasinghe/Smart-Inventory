import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontSize: 12,
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 20,
    borderBottom: '2pt solid #2D3748',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 10,
    backgroundColor: '#F7FAFC',
    padding: 8,
    borderLeft: '3pt solid #4299E1',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F7FAFC',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    border: '1pt solid #E2E8F0',
  },
  statLabel: {
    fontSize: 10,
    color: '#718096',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 15,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#F7FAFC',
    padding: 8,
    fontWeight: 'bold',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
  },
  riskHigh: {
    color: '#E53E3E',
    fontWeight: 'bold',
  },
  riskMedium: {
    color: '#DD6B20',
    fontWeight: 'bold',
  },
  riskLow: {
    color: '#38A169',
    fontWeight: 'bold',
  },
  alert: {
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  alertWarning: {
    backgroundColor: '#FEF5E7',
    borderLeft: '3pt solid #DD6B20',
  },
  alertInfo: {
    backgroundColor: '#EBF8FF',
    borderLeft: '3pt solid #3182CE',
  },
  alertSuccess: {
    backgroundColor: '#F0FFF4',
    borderLeft: '3pt solid #38A169',
  },
  summary: {
    backgroundColor: '#F7FAFC',
    padding: 15,
    borderRadius: 4,
    border: '1pt solid #E2E8F0',
    marginBottom: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#718096',
    fontSize: 10,
    borderTop: '1pt solid #E2E8F0',
    paddingTop: 10,
  },
});

// PDF Document Component
const PDFDocument = ({ data }) => {
  const getRiskStyle = (risk) => {
    switch (risk) {
      case 'High': return styles.riskHigh;
      case 'Medium': return styles.riskMedium;
      case 'Low': return styles.riskLow;
      default: return {};
    }
  };

  const getAlertStyle = (type) => {
    switch (type) {
      case 'warning': return styles.alertWarning;
      case 'info': return styles.alertInfo;
      case 'success': return styles.alertSuccess;
      default: return {};
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.subtitle}>
            Generated on: {data.generatedDate} | Time Range: {data.timeRange} View
          </Text>
        </View>

        {/* Executive Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.summary}>
            <Text>
              This report provides a comprehensive overview of Smart inventory management. 
              Key highlights include {data.summary.totalHighRiskItems} high-risk items nearing expiry 
              across {data.summary.highRiskCategories} categories, with an average stock turnover rate of {data.summary.averageTurnover}%.
            </Text>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
          <View style={styles.statsContainer}>
            {data.inventoryStats.map((stat, idx) => (
              <View key={idx} style={styles.statCard}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>
                  {typeof stat.value === 'number' && stat.label.includes('Value') 
                    ? `Rs ${stat.value.toLocaleString()}` 
                    : stat.value}
                </Text>
                <Text style={{ fontSize: 10, color: stat.trend === 'up' ? '#38A169' : stat.trend === 'down' ? '#E53E3E' : '#718096' }}>
                  {stat.change} {stat.trend === 'stable' ? 'this month' : 'from last period'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Expiry Risk Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expiry Risk Analysis</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Category</Text>
              <Text style={styles.tableColHeader}>Items Near Expiry</Text>
              <Text style={styles.tableColHeader}>Risk Level</Text>
              <Text style={styles.tableColHeader}>Priority</Text>
            </View>
            {/* Table Rows */}
            {data.expiryData.map((category, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.tableCol}>{category.category}</Text>
                <Text style={styles.tableCol}>{category.items} items</Text>
                <Text style={[styles.tableCol, getRiskStyle(category.risk)]}>
                  {category.risk} Risk
                </Text>
                <Text style={styles.tableCol}>
                  {category.risk === 'High' ? 'Immediate Action' : category.risk === 'Medium' ? 'Monitor Closely' : 'Low Priority'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Category Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventory Distribution</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Category</Text>
              <Text style={styles.tableColHeader}>Percentage</Text>
              <Text style={styles.tableColHeader}>Status</Text>
            </View>
            {data.categoryDistribution.map((category, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.tableCol}>{category.name}</Text>
                <Text style={styles.tableCol}>{category.value}%</Text>
                <Text style={styles.tableCol}>
                  {category.value > 30 ? 'High Concentration' : category.value > 15 ? 'Medium Concentration' : 'Low Concentration'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Alerts and Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Critical Alerts & Insights</Text>
          {data.spoilageAlerts.map((alert, idx) => (
            <View key={idx} style={[styles.alert, getAlertStyle(alert.type)]}>
              <Text>{alert.message}</Text>
            </View>
          ))}
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          <View style={styles.summary}>
            <Text>• Implement immediate stock clearance for high-risk categories</Text>
            <Text>• Optimize ordering cycles for Dairy and Produce categories</Text>
            <Text>• Review and adjust safety stock levels for medium-risk items</Text>
            <Text>• Continue monitoring spoilage rates and turnover performance</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Confidential Business Report - Smart Inventory Management System
        </Text>
      </Page>
    </Document>
  );
};

export { PDFDocument };