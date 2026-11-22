import PDFKit
import AppKit
let args = CommandLine.arguments
guard let doc = PDFDocument(url: URL(fileURLWithPath: args[1])) else { fatalError("cannot open pdf") }
let scale: CGFloat = 2.0
for i in 0..<doc.pageCount {
  guard let page = doc.page(at: i) else { continue }
  let box = page.bounds(for: .mediaBox)
  let size = NSSize(width: box.width * scale, height: box.height * scale)
  let img = NSImage(size: size)
  img.lockFocus()
  NSColor.white.setFill(); NSRect(origin: .zero, size: size).fill()
  let ctx = NSGraphicsContext.current!.cgContext
  ctx.scaleBy(x: scale, y: scale)
  page.draw(with: .mediaBox, to: ctx)
  img.unlockFocus()
  let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: "\(args[2])/page-\(i + 1).png"))
  print("page \(i + 1): \(Int(size.width))x\(Int(size.height))")
}
