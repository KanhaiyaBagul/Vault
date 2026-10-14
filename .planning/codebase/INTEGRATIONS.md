# External Integrations: Clusion Codebase

## 1. Document Extraction Engines
- **Apache PDFBox**:
  - `org.apache.pdfbox.pdfparser.PDFParser` & `org.apache.pdfbox.text.PDFTextStripper`
  - Integrated in `TextExtractPar.java` for reading `.pdf` binary streams.
- **Apache POI**:
  - `org.apache.poi.xwpf.extractor.XWPFWordExtractor` (.docx)
  - `org.apache.poi.hwpf.extractor.WordExtractor` (.doc)
  - `org.apache.poi.xssf.extractor.XSSFExcelExtractor` (.xlsx)
  - `org.apache.poi.xslf.extractor.XSLFPowerPointExtractor` (.pptx)
  - Integrated in `TextExtractPar.java`.

## 2. Inverted Indexing & Stemming
- **Apache Lucene**:
  - `StandardAnalyzer` and `EnglishAnalyzer`
  - Integrated in `Tokenizer.java` and `TextExtractPar.java` for token stream filtering and stop-word removal.

## 3. Storage & Embedded Databases
- **MapDB**:
  - Integrated in `DynRH_Disk.java` for disk-backed key-value persistence of encrypted indices.
- **Java Serialization**:
  - `Serializer.java` provides object stream serialization for in-memory encrypted multi-maps.

## 4. Distributed Cloud Engines (Upstream Benchmark)
- **Apache Hadoop & AWS EMR**:
  - `IEX2LevAMAZON.java` integrates Hadoop MapReduce 2.7.1 and AWS Java SDK 1.11.19 for distributed text indexing on Amazon AWS EC2/EMR clusters.
