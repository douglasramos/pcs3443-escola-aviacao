from setuptools import setup, find_packages

setup(
    name='rest_api_demo',
    version='1.0.0',
    description='Restful-API para Escola de aviação',
    url='',
    author='',

    classifiers=[
        'Development Status :: Under development',
        'Intended Audience :: Developers',
        'Topic :: Software Development :: Libraries :: Application Frameworks',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3.7',
    ],

    keywords='',

    packages=find_packages(),

    install_requires=['flask-restplus==0.12.1', 'pony==0.7.10'],
)
