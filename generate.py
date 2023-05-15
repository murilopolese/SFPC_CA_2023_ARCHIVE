import os
import shutil
from pathlib import Path
from markdown import markdown

def document(title = '', page_content = '', back = '', children = ''):
    return """
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>{title}</title>
    <link rel="stylesheet" href="/style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <p><a href="/{back}">Back</a></p>
    {page_content}
    {children}
    <p><a href="/{back}">Back</a></p>
  </body>
</html>
    """.format(
        title = title,
        back = back,
        page_content = page_content,
        children = children
    )

for dirname, dirnames, filenames in os.walk('./content'):
    # sort alphabetically
    dirnames.sort()
    filenames.sort()

    # Create html folder for generated website
    out_dir = Path(dirname.replace('content', 'html'))
    out_dir.mkdir(parents=True, exist_ok=True)

    if 'uploads' in dirnames:
        # Do not process upload folder
        dirnames.remove('uploads')
        # Copy it as it is to the output directory
        shutil.copytree(
            os.path.join(dirname, 'uploads'),
            os.path.join(out_dir, 'uploads'),
            dirs_exist_ok=True
        )


    # ============ GENERATE INDEX FILES =====================
    page_content = ""

    """
    An index file is a markdown file with a homonymous sibling folder
    """
    md_path = Path(dirname + '.md')
    if md_path.exists():
        page_content = markdown(md_path.read_text(), extensions=['attr_list'])

    """
    The children of each index page are all the current folder
    """
    children_content = "<ul>"
    clean_dirname = dirname.replace('/content', '')

    for child in filenames:
        name = child.split('.')[0]
        if name not in dirnames:
            children_content += """
                <li><a href="/{link}">{text}</a></li>
            """.format(
                link = os.path.join(clean_dirname, name) + '.html',
                text = name
            )
        else:
            children_content += """
                <li><a href="/{link}">{text}</a></li>
            """.format(
                link = os.path.join(clean_dirname, name),
                text = name
            )

    children_content += "</ul>"

    title = dirname.replace('./content/', '')
    back_array = title.split('/')
    back_array.pop()
    back = '/'.join(back_array)
    index_page = document(
        title = title,
        back = back,
        page_content = page_content,
        children = children_content
    )

    index_path = Path(os.path.join(out_dir, 'index.html'))
    index_path.write_text(index_page)

    for file in filenames:
        name = file.split('.')[0]
        if name not in dirnames:
            page_path = Path(os.path.join(dirname, file))
            page_content = markdown(page_path.read_text(), extensions=['attr_list'])
            file_page = document(
                title = title,
                page_content = page_content,
                back = clean_dirname
            )
            page_out = Path(os.path.join(out_dir, name) + '.html')
            page_out.write_text(file_page)

# move static files to the generated html folder
shutil.copytree(
    'static',
    'html',
    dirs_exist_ok=True
)
