# Como Contribuir com o PetConnect 🐾

Obrigado pelo seu interesse em contribuir com o PetConnect! Este documento explica como participar do desenvolvimento de nossa plataforma que conecta pets resgatados com famílias amorosas.

## 📋 Índice
- [Código de Conduta](#código-de-conduta)
- [Como Começar](#como-começar)
- [Tipos de Contribuição](#tipos-de-contribuição)
- [Processo de Contribuição](#processo-de-contribuição)
- [Padrões de Código](#padrões-de-código)
- [Convenções](#convenções)
- [Testes](#testes)
- [Dúvidas](#dúvidas)

## 🤝 Código de Conduta

O PetConnect é um projeto inclusivo e acolhedor. Esperamos que todos os contribuidores:

- Sejam respeitosos e construtivos em suas interações
- Foquem no bem-estar dos animais como objetivo principal
- Ajudem a criar um ambiente colaborativo e de aprendizado
- Sigam as boas práticas de desenvolvimento

## 🚀 Como Começar

### Para Iniciantes
1. **Leia a documentação completa** no [README.md](README.md) e [SETUP.md](docs/SETUP.md)
2. **Configure o ambiente** seguindo o guia de instalação
3. **Explore o código** para entender a estrutura do projeto
4. **Procure issues marcadas** com `good first issue` ou `help wanted`

### Para Desenvolvedores Experientes
1. **Analise a arquitetura** do projeto
2. **Revise os roadmaps** e funcionalidades planejadas
3. **Identifique áreas** onde pode contribuir significativamente
4. **Proponha melhorias** através de issues ou discussions

## 🎯 Tipos de Contribuição

Valorizamos todos os tipos de contribuição:

### 💻 Desenvolvimento
- **Frontend**: Interface do usuário, componentes React, responsividade
- **Backend**: APIs, integrações, banco de dados



### 🎨 Design
- **UI/UX**: Wireframes, protótipos, design system
- **Branding**: Logos, identidade visual
- **Ilustrações**: Ícones, imagens, mascotes

### 📝 Documentação
- **Técnica**: APIs, componentes, arquitetura
- **Usuario**: Guias, tutoriais, FAQ
- **Tradução**: Internacionalização do projeto

### 🧪 Qualidade
- **Testes**: Unitários e integração
- **Revisão de código**: Pull Request reviews
- **Bug reports**: Identificação e reprodução de problemas

### 🌐 Comunidade
- **Suporte**: Ajuda em issues e discussions
- **Evangelização**: Compartilhar o projeto
- **Feedback**: Melhorias e sugestões

## 🔄 Processo de Contribuição

### 1. Preparação
```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU-USUARIO/petconnect.git
cd petconnect

# Configure o repositório upstream
git remote add upstream https://github.com/petconnect/petconnect.git

# Configure seu ambiente
npm install
```

### 2. Desenvolvimento
```bash
# Atualize sua branch dev
git checkout dev
git pull upstream dev

# Crie uma branch para sua contribuição
git checkout -b feature/sua-contribuicao

# Desenvolva sua funcionalidade
# Faça commits seguindo nossas convenções
git add .
git commit -m "feat(pets): adiciona filtro por tamanho do pet"

# Push para seu fork
git push origin feature/sua-contribuicao
```

### 3. Pull Request
1. **Abra um PR** do seu fork para `petconnect/petconnect:dev`
2. **Preencha o template** com todas as informações solicitadas
3. **Aguarde a revisão** e responda aos comentários
4. **Faça ajustes** se necessário
5. **Comemore** quando seu PR for aceito! 🎉

## 📏 Padrões de Código

### JavaScript/React
```javascript
// ✅ Bom
const PetCard = ({ pet, onFavorite }) => {
  const handleFavoriteClick = useCallback(() => {
    onFavorite(pet.id);
  }, [pet.id, onFavorite]);

  return (
    <div className="pet-card">
      <img src={pet.image} alt={`Foto de ${pet.name}`} />
      <h3>{pet.name}</h3>
      <button onClick={handleFavoriteClick}>
        Favoritar
      </button>
    </div>
  );
};

// ❌ Evitar
function petcard(pet) {
  return <div><img src={pet.image}/><h3>{pet.name}</h3></div>
}
```

### CSS
```css
/* ✅ Bom - Use BEM ou Tailwind */
.pet-card {
  @apply bg-white rounded-lg shadow-md p-4;
}

.pet-card__image {
  @apply w-full h-48 object-cover rounded-md;
}

.pet-card__title {
  @apply text-lg font-semibold mt-2;
}

/* ❌ Evitar */
.card { background: white; }
.image { width: 100%; }
```

### Estrutura de Arquivos
```
src/
├── components/           # Componentes reutilizáveis
│   ├── common/          # Botões, inputs, etc.
│   ├── forms/           # Formulários específicos
│   └── layout/          # Header, footer, sidebar
├── pages/               # Páginas da aplicação
├── hooks/               # Custom hooks
├── services/            # APIs e integrações
├── utils/               # Funções utilitárias
├── styles/              # CSS global e variáveis
└── constants/           # Constantes da aplicação
```

## 📝 Convenções

### Commits
Siga o formato [Conventional Commits](https://conventionalcommits.org/):

```
<tipo>(escopo): descrição

Corpo opcional explicando o que e por que

Footer opcional
```

**Tipos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, sem mudança lógica
- `refactor`: Reestruturação sem mudança de funcionalidade
- `test`: Testes
- `chore`: Tarefas de build, CI, etc.

**Exemplos:**
```bash
feat(pets): adiciona filtro por idade
fix(auth): corrige validação de email
docs(readme): atualiza instruções de instalação
```

### Branches
- `main`: Produção (protegida)
- `dev`: Desenvolvimento (protegida)
- `feature/descricao`: Novas funcionalidades
- `bugfix/descricao`: Correções
- `hotfix/descricao`: Correções urgentes
- `docs/descricao`: Documentação

### Issues
Use os templates disponíveis:
- **Bug Report**: Para reportar problemas
- **Feature Request**: Para sugerir funcionalidades
- **Documentation**: Para melhorias na documentação
- **Question**: Para dúvidas gerais

## 📋 Checklist Antes do PR

### Desenvolvimento
- [ ] Código segue os padrões estabelecidos
- [ ] Funcionalidade testada localmente
- [ ] Testes unitários escritos e passando
- [ ] Sem console.log ou código debug
- [ ] Documentação atualizada se necessário

### Git
- [ ] Branch atualizada com dev
- [ ] Commits seguem convenção
- [ ] Mensagens de commit são descritivas
- [ ] Não há arquivos desnecessários

### Pull Request
- [ ] Template preenchido completamente
- [ ] Screenshots adicionadas (se UI)
- [ ] Issues relacionadas linkadas
- [ ] Reviewers adicionados

## 🆘 Dúvidas e Suporte

### Onde Buscar Ajuda
1. **Documentação**: Verifique README.md e docs/
2. **Issues**: Procure por dúvidas similares
3. **Discussions**: Participe das discussões da comunidade
4. **Discord/Slack**: Entre no nosso canal de comunicação

### Como Fazer Perguntas
- **Seja específico**: Descreva exatamente o problema
- **Contexto**: Explique o que tentou fazer
- **Reprodução**: Forneça passos para reproduzir
- **Ambiente**: SO, versão do Node, navegador, etc.

### Revisão de PRs
- **Seja construtivo**: Foque em melhorias, não críticas pessoais
- **Explique o porquê**: Justifique suas sugestões
- **Aprove quando apropriado**: Reconheça bom trabalho
- **Teste localmente**: Quando possível, teste as mudanças

## 🏆 Reconhecimento

Contribuidores ativos serão reconhecidos:

- **README.md**: Lista de contribuidores
- **Releases**: Menção em notas de versão
- **Social Media**: Divulgação de contribuições importantes
- **Meetups**: Convites para apresentar o projeto

## 📞 Contato

- **Email**: dev@petconnect.com
- **GitHub Issues**: Para bugs e features
- **GitHub Discussions**: Para discussões gerais
- **Discord**: [Link do servidor](https://discord.gg/petconnect)

---

**Lembre-se**: Cada linha de código contribui para salvar vidas de animais! Obrigado por fazer parte dessa missão. 🐕🐱❤️

## 📊 Status do Projeto

![GitHub issues](https://img.shields.io/github/issues/petconnect/petconnect)
![GitHub pull requests](https://img.shields.io/github/issues-pr/petconnect/petconnect)
![GitHub contributors](https://img.shields.io/github/contributors/petconnect/petconnect)
![GitHub stars](https://img.shields.io/github/stars/petconnect/petconnect?style=social)